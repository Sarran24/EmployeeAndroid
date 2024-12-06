//package com.first.kotlin.kotlinDemo.service
//
//
//
//
//import com.first.kotlin.kotlinDemo.employee.Employee
//import org.springframework.stereotype.Service
//
//@Service
//class FirestoreService {
//
//    private val db: FirebaseFirestore = FirebaseFirestore.getInstance()
//
//    // Add a new employee to Firestore
//    fun createEmployee(employee: Employee): Employee {
//        val employeeRef = db.collection("employees").document(employee.id.toString())
//        employeeRef.set(employee)
//            .addOnSuccessListener {
//                println("Employee added with ID: ${employee.id}")
//            }
//            .addOnFailureListener {
//                println("Error adding employee: ${it.message}")
//            }
//        return employee
//    }
//
//    // Get employee by ID from Firestore
//    fun getEmployeeById(id: Long): Employee? {
//        val employeeRef = db.collection("employees").document(id.toString())
//        val document: DocumentSnapshot = employeeRef.get().get()
//
//        return if (document.exists()) {
//            document.toObject(Employee::class.java)
//        } else {
//            null
//        }
//    }
//
//    // Get all employees from Firestore
//    fun getAllEmployees(): List<Employee> {
//        val employees = mutableListOf<Employee>()
//        val querySnapshot = db.collection("employees").get().get()
//
//        for (document in querySnapshot) {
//            val employee = document.toObject(Employee::class.java)
//            employees.add(employee)
//        }
//
//        return employees
//    }
//
//    // Update an existing employee in Firestore
//    fun updateEmployee(id: Long, updatedEmployee: Employee): Employee? {
//        val employeeRef = db.collection("employees").document(id.toString())
//        val document = employeeRef.get().get()
//
//        return if (document.exists()) {
//            employeeRef.set(updatedEmployee)
//                .addOnSuccessListener {
//                    println("Employee updated with ID: ${updatedEmployee.id}")
//                }
//                .addOnFailureListener {
//                    println("Error updating employee: ${it.message}")
//                }
//            updatedEmployee
//        } else {
//            null
//        }
//    }
//
//    // Delete an employee from Firestore
//    fun deleteEmployee(id: Long): Boolean {
//        val employeeRef = db.collection("employees").document(id.toString())
//        val document = employeeRef.get().get()
//
//        return if (document.exists()) {
//            employeeRef.delete()
//                .addOnSuccessListener {
//                    println("Employee deleted with ID: $id")
//                }
//                .addOnFailureListener {
//                    println("Error deleting employee: ${it.message}")
//                }
//            true
//        } else {
//            false
//        }
//    }
//}
