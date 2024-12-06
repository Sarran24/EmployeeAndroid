package com.first.kotlin.kotlinDemo.service

import com.first.kotlin.kotlinDemo.employee.Employee
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import org.springframework.http.HttpStatus

@Service
class EmployeeService(private val firestore: Firestore) {

    private val collection = "employee"

    fun getAllEmployees(): List<Employee> {
        val employees = mutableListOf<Employee>()
        val querySnapshot = firestore.collection(collection).get().get()

        for (document in querySnapshot.documents) {
            val employee = document.toObject(Employee::class.java)
            if (employee.isActive) {
                employee.id = document.id
                employees.add(employee)
            }
        }
        return employees
    }

    // Create a new employee
    fun createEmployee(employee: Employee): String {
        val document = firestore.collection(collection).document()
        document.set(employee).get()
        return "Employee added with ID: ${document.id}"
    }

    // Get employee by ID
    fun getEmployeeById(id: String): Employee {
        val document = firestore.collection(collection).document(id).get().get()
        if (!document.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")
        }
        val employee = document.toObject(Employee::class.java)
        employee?.id = document.id
        return employee ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error parsing employee data")
    }

    // Update employee by ID
    fun updateEmployee(id: String, updatedEmployee: Employee): String {
        val documentRef = firestore.collection(collection).document(id)
        val document = documentRef.get().get()
        if (!document.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")
        }
        documentRef.set(updatedEmployee).get()
        return "Employee with ID: $id has been updated"
    }

    // Deactivate employee by ID (soft delete)
    fun deleteEmployee(id: String): String {
        val documentRef = firestore.collection(collection).document(id)
        val document = documentRef.get().get()
        if (!document.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found")
        }
        documentRef.update("active", false).get()
        return "Employee with ID: $id has been deactivated"
    }
}
