package com.first.kotlin.kotlinDemo.service

import com.first.kotlin.kotlinDemo.Utility.DepartmentConstants
import com.first.kotlin.kotlinDemo.domain.Department
import com.first.kotlin.kotlinDemo.dto.DepartmentDTO
import com.first.kotlin.kotlinDemo.exception.InvalidRequestException
import com.first.kotlin.kotlinDemo.mapper.DepartmentMapper
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import org.springframework.http.HttpStatus

@Service
class DepartmentService(private val firestore: Firestore, private val roleService: RoleService) {

    private val collection = "departments"

    fun createDepartments(departments: List<Department>): List<Map<String, String>> {
        val invalidDepartments =
            departments.filter { it.name !in DepartmentConstants.VALID_DEPARTMENTS }.map { it.name }

        if (invalidDepartments.isNotEmpty()) {
            throw InvalidRequestException("Invalid departments: ${invalidDepartments.joinToString(", ")}")
        }

        val existingDepartmentsMap = firestore.collection(collection).get().get().documents.mapNotNull {
            it.toObject(
                Department::class.java
            )?.name to it.id
        }.toMap()

        val newDepartments = departments.filter { it.name !in existingDepartmentsMap.keys }

        if (newDepartments.isEmpty()) {
            throw InvalidRequestException("All departments already exist in the database.")
        }
        return newDepartments.map { department ->
            if (department.isActive == null) {
                department.isActive = true
            }

            val document = firestore.collection(collection).document()
            document.set(department).get()

            mapOf(
                "id" to document.id,
                "name" to department.name,
                "location" to department.location,
                "budget" to department.budget.toString(),
                "isActive" to department.isActive.toString()
            )
        }
    }

    fun getActiveDepartments(): List<DepartmentDTO> {
        val documents = mutableListOf<DepartmentDTO>()

        val querySnapshot = firestore.collection(collection).get().get()
        for (document in querySnapshot.documents) {
            val department = document.toObject(Department::class.java)
            if (department?.isActive == true) {
                department.id = document.id
                val roles = roleService.getRolesByDepartmentId(department.id ?: "")
                documents.add(DepartmentMapper.toDTO(department, roles))
            }
        }
        return documents
    }



    fun getDepartmentById(id: String): DepartmentDTO {
        val doc = firestore.collection(collection).document(id).get().get()

        return if (doc.exists()) {
            val department = doc.toObject(Department::class.java)?.apply { this.id = doc.id }
                ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error mapping department object")

            val roles = roleService.getRolesByDepartmentId(department.id ?: "")

            DepartmentMapper.toDTO(department, roles)
        } else {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Department with ID $id not found")
        }
    }

    fun updateDepartment(updatedDepartmentDTO: DepartmentDTO): DepartmentDTO {
        val departmentId = updatedDepartmentDTO.id
            ?: throw IllegalArgumentException("Department ID must not be null for update operation.")
        val docRef = firestore.collection(collection).document(departmentId)
        val updatedDepartment = DepartmentMapper.toEntity(updatedDepartmentDTO)
        docRef.set(updatedDepartment).get()
        return DepartmentMapper.toDTO(updatedDepartment, updatedDepartmentDTO.roles)
    }



    fun softDeleteDepartment(id: String) {
        val docRef = firestore.collection(collection).document(id)
        val document = docRef.get().get()
        if (!document.exists()) {
            throw IllegalArgumentException("Department not found")
        }
        docRef.update("isActive", false).get()
    }
}
