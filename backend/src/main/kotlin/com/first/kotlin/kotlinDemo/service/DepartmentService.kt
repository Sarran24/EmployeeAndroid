package com.first.kotlin.kotlinDemo.service

import com.first.kotlin.kotlinDemo.Utility.DepartmentConstants
import com.first.kotlin.kotlinDemo.domain.Department
import com.first.kotlin.kotlinDemo.domain.Employee
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import com.google.cloud.firestore.Firestore
import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.DocumentReference
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

@Service
class DepartmentService(private val firestore: Firestore) {


    private val collection = "departments" // Firestore collection name for departments

    @Service
    class DepartmentService(private val firestore: Firestore) {

        private val collection = "departments" // Firestore collection name for departments

        // Function to create a new department with validation
        fun createDepartment(department: Department): Department {
            // Validate department name
            if (department.name.isBlank()) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Department name cannot be blank.")
            }

            // Ensure department name is valid using the constants from DepartmentConstants
            if (department.name !in DepartmentConstants.VALID_DEPARTMENTS) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid department name: ${department.name}.")
            }

            // If 'isActive' is not set, default it to true
            if (department.isActive == null) {
                department.isActive = true  // Set isActive to true by default
            }

            // Add the department to Firestore
            val docRef = firestore.collection(collection).add(department).get()

            // Set the generated document ID to the department
            department.id = docRef.id

            return department
        }
    }

    fun getActiveDepartments(): List<Department> {
        val documents = mutableListOf<Department>()

        val querySnapshot = firestore.collection(collection).get().get()
        for (document in querySnapshot.documents) {
            val document = document.toObject(Department::class.java)
            if (document.isActive) {
                document.id = document.id
                documents.add(document)
            }
        }
        return documents
    }


    // Get department by ID
    fun getDepartmentById(id: String): Department {
        val doc = firestore.collection(collection).document(id).get().get()
        return if (doc.exists()) {
            doc.toObject(Department::class.java)?.apply { this.id = doc.id }
                ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error mapping department object")
        } else {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Department with ID $id not found")
        }
    }

    // Update department by ID
    fun updateDepartment(id: String, updatedDepartment: Department): Department {
        val docRef = firestore.collection(collection).document(id)
        updatedDepartment.id = id
        docRef.set(updatedDepartment).get()
        return updatedDepartment
    }

    // Soft delete department by ID
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
