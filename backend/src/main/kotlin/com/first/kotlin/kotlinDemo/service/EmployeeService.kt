package com.first.kotlin.kotlinDemo.service

import com.first.kotlin.kotlinDemo.domain.Employee
import com.first.kotlin.kotlinDemo.dto.EmployeeDTO
import com.first.kotlin.kotlinDemo.mapper.EmployeeMapper
import com.google.cloud.firestore.Firestore
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class EmployeeService(private val firestore: Firestore) {

    private val collection = "employee"

    fun getAllEmployees(): List<EmployeeDTO> {
        val employees = mutableListOf<EmployeeDTO>()
        val querySnapshot = firestore.collection(collection).get().get()

        for (document in querySnapshot.documents) {
            val employee = document.toObject(Employee::class.java)
            if (employee?.isActive == true) {
                employee.id = document.id
                employees.add(EmployeeMapper.toDTO(employee))
            }
        }
        return employees
    }

    fun createEmployee(employeeDTO: EmployeeDTO): String {
        val employee = EmployeeMapper.toEntity(employeeDTO)
        val document = firestore.collection(collection).document()
        document.set(employee).get()
        return "Employee added with ID: ${document.id}"
    }

    fun getEmployeeById(id: String): EmployeeDTO {
        val document = firestore.collection(collection).document(id).get().get()
        if (!document.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")
        }
        val employee = document.toObject(Employee::class.java)
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error parsing employee data")
        employee.id = document.id
        return EmployeeMapper.toDTO(employee)
    }

    fun updateEmployee(id: String, updatedEmployeeDTO: EmployeeDTO): String {
        val documentRef = firestore.collection(collection).document(id)
        val document = documentRef.get().get()
        if (!document.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")
        }
        val updatedEmployee = EmployeeMapper.toEntity(updatedEmployeeDTO)
        documentRef.set(updatedEmployee).get()
        return "Employee with ID: $id has been updated"
    }

    fun deleteEmployee(id: String): String {
        val documentRef = firestore.collection(collection).document(id)
        val document = documentRef.get().get()
        if (!document.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")
        }
        documentRef.update("isActive", false).get()
        return "Employee with ID: $id has been deactivated"
    }

    fun uploadProfilePicture(id: String, base64: String): String {
        val documentRef = firestore.collection(collection).document(id)
        val document = documentRef.get().get()

        if (!document.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")
        }

        // Extract the actual base64 string if it is wrapped in a JSON-like structure
        val cleanedBase64 = if (base64.startsWith("{") && base64.contains("\"profilePicture\":")) {
            // Extract the part after "profilePicture" key
            val regex = Regex("\"profilePicture\"\\s*:\\s*\"(.*?)\"")
            regex.find(base64)?.groups?.get(1)?.value ?: throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid profilePicture format"
            )
        } else {
            base64 // If it's already a clean base64 string
        }.replace("\r", "").replace("\n", "").trim()

        // Save the cleaned base64 string
        val updateFuture = documentRef.update("profilePicture", cleanedBase64)
        updateFuture.get()

        return "Profile picture uploaded successfully for Employee ID: $id"
    }



    fun getProfilePicture(id: String): String {
        val documentRef = firestore.collection(collection).document(id)
        val document = documentRef.get().get()
        if (!document.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")
        }

        return document.getString("profilePicture")
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Profile picture not found")
    }
}
