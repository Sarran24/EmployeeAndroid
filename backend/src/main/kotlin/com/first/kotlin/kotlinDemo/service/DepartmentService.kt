package com.first.kotlin.kotlinDemo.service

import com.first.kotlin.kotlinDemo.Utility.DepartmentConstants
import com.first.kotlin.kotlinDemo.domain.Department
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import org.springframework.http.HttpStatus

@Service
class DepartmentService(private val firestore: Firestore) {

    private val collection = "departments"

    fun createDepartment(department: Department): Department {
        if (department.name.isBlank()) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Department name cannot be blank.")
        }

        if (department.name !in DepartmentConstants.VALID_DEPARTMENTS) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid department name: ${department.name}.")
        }

        if (department.isActive == null) {
            department.isActive = true
        }

        val docRef = firestore.collection(collection).add(department).get()

        department.id = docRef.id

        return department
    }

    fun getActiveDepartments(): List<Department> {
        val documents = mutableListOf<Department>()

        val querySnapshot = firestore.collection(collection).get().get()
        for (document in querySnapshot.documents) {
            val department = document.toObject(Department::class.java)
            if (department?.isActive == true) {
                department.id = document.id
                documents.add(department)
            }
        }
        return documents
    }

    fun getDepartmentById(id: String): Department {
        val doc = firestore.collection(collection).document(id).get().get()
        return if (doc.exists()) {
            doc.toObject(Department::class.java)?.apply { this.id = doc.id }
                ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error mapping department object")
        } else {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Department with ID $id not found")
        }
    }

    fun updateDepartment(id: String, updatedDepartment: Department): Department {
        val docRef = firestore.collection(collection).document(id)
        updatedDepartment.id = id
        docRef.set(updatedDepartment).get()
        return updatedDepartment
    }

    fun softDeleteDepartment(id: String) {
        val docRef = firestore.collection(collection).document(id)

        // Check if the department exists before performing the soft delete
        val document = docRef.get().get()

        if (!document.exists()) {
            throw IllegalArgumentException("Department not found")
        }

        // Mark the department as inactive
        docRef.update("isActive", false).get()
    }
}
