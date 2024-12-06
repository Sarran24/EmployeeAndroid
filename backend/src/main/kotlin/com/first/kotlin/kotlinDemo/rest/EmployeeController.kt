package com.first.kotlin.kotlinDemo.rest

import com.first.kotlin.kotlinDemo.employee.Employee
import com.first.kotlin.kotlinDemo.service.EmployeeService
import org.springframework.web.bind.annotation.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/employees")
class EmployeeController(private val employeeService: EmployeeService) {

    // Get all active employees
    @GetMapping
    fun getAllEmployees(): List<Employee> {
        return employeeService.getAllEmployees()
    }

    // Create a new employee
    @PostMapping
    fun createEmployee(@RequestBody employee: Employee): ResponseEntity<Map<String, String>> {
        println("Received request to create employee: $employee")
        employeeService.createEmployee(employee)

        val responseBody = mapOf(
            "message" to "Employee created successfully", "status" to HttpStatus.CREATED.reasonPhrase
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody)
    }


    @GetMapping("/{id}")
    fun getEmployeeById(@PathVariable id: String): ResponseEntity<Employee> {
        val employee = employeeService.getEmployeeById(id)
        return if (employee != null) {
            ResponseEntity.ok(employee)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null) // or throw a custom exception
        }
    }

    // Update employee by ID
    @PutMapping("/{id}")
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
    @DeleteMapping("/{id}")
    fun deleteEmployee(@PathVariable id: String): ResponseEntity<Map<String, String>> {
        employeeService.deleteEmployee(id)
        val responseBody = mapOf(
            "message" to "Employee deleted successfully", "status" to HttpStatus.OK.reasonPhrase
        )
        return ResponseEntity.ok(responseBody)
    }
}
