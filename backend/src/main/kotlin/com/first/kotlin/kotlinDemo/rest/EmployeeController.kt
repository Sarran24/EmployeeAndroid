package com.first.kotlin.kotlinDemo.rest

import com.first.kotlin.kotlinDemo.employee.Employee
import com.first.kotlin.kotlinDemo.service.EmployeeService
import org.springframework.web.bind.annotation.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api")
class EmployeeController(private val employeeService: EmployeeService) {

    // Get all active employees
    @GetMapping("/employess")
    fun getAllEmployees(): List<Employee> {
        return employeeService.getAllEmployees()
    }

    // Create a new employee
    @PostMapping("/employee")
    fun createEmployee(@RequestBody employee: Employee): ResponseEntity<Map<String, String>> {
        println("Received request to create employee: $employee")
        employeeService.createEmployee(employee)

        val responseBody = mapOf(
            "message" to "Employee created successfully", "status" to HttpStatus.CREATED.reasonPhrase
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody)
    }


    @GetMapping("employee/{id}")
    fun getEmployeeById(@PathVariable id: String): ResponseEntity<Employee> {
        val employee = employeeService.getEmployeeById(id)
        return if (employee != null) {
            ResponseEntity.ok(employee)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null) // or throw a custom exception
        }
    }

    // Update employee by ID
    @PutMapping("employee/{id}")
    fun updateEmployee(
        @PathVariable id: String, @RequestBody updatedEmployee: Employee
    ): ResponseEntity<Map<String, String>> {
        employeeService.updateEmployee(id, updatedEmployee)
        val responseBody = mapOf(
            "message" to "Employee updated successfully", "status" to HttpStatus.OK.reasonPhrase
        )
        return ResponseEntity.ok(responseBody)
    }

    // Deactivate employee (soft delete)
    @DeleteMapping("employee/{id}")
    fun deleteEmployee(@PathVariable id: String): ResponseEntity<Map<String, String>> {
        employeeService.deleteEmployee(id)
        val responseBody = mapOf(
            "message" to "Employee deleted successfully", "status" to HttpStatus.OK.reasonPhrase
        )
        return ResponseEntity.ok(responseBody)
    }

    @PostMapping("employee/profile/picture/{id}")
    fun uploadProfilePicture(
        @PathVariable id: String,
        @RequestParam file: MultipartFile
    ): ResponseEntity<Map<String, String>> {
        return try {
            val message = employeeService.uploadProfilePicture(id, file)
            val responseBody = mapOf(
                "message" to message,
                "status" to HttpStatus.OK.reasonPhrase
            )
            ResponseEntity.status(HttpStatus.OK).body(responseBody)
        } catch (e: Exception) {
            val errorResponse = mapOf(
                "message" to (e.message ?: "Unknown error"), // Correct usage of 'to' for creating pairs
                "status" to HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }

    // Get profile picture for an employee
    @GetMapping("employee/profile/picture/{id}")
    fun getProfilePicture(@PathVariable id: String): ResponseEntity<Map<String, String>> {
        return try {
            val base64Image = employeeService.getProfilePicture(id)
            val responseBody = mapOf(
                "profilePicture" to base64Image,
                "status" to HttpStatus.OK.reasonPhrase
            )
            ResponseEntity.ok(responseBody)
        } catch (e: Exception) {
            val errorResponse = mapOf(
                "message" to (e.message ?: "Profile picture not found"), // Correct usage of 'to' for creating pairs
                "status" to HttpStatus.NOT_FOUND.reasonPhrase
            )
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse)
        }
    }
}
