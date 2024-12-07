package com.first.kotlin.kotlinDemo.rest

import com.first.kotlin.kotlinDemo.domain.Employee
import com.first.kotlin.kotlinDemo.dto.EmployeeDTO
import com.first.kotlin.kotlinDemo.payload.ResponsePayload
import com.first.kotlin.kotlinDemo.service.EmployeeService
import org.springframework.web.bind.annotation.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api")
class EmployeeController(private val employeeService: EmployeeService) {

    @PostMapping("/employee")
    fun createEmployee(@RequestBody employee: EmployeeDTO): ResponseEntity<ResponsePayload<Map<String, String>>> {
        employeeService.createEmployee(employee)
        val responseBody = ResponsePayload(
            message = "Employee created successfully",
            status = HttpStatus.CREATED.reasonPhrase,
            body = mapOf("status" to HttpStatus.CREATED.reasonPhrase)
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody)
    }

    @GetMapping("/employees")
    fun getAllEmployees(): ResponseEntity<ResponsePayload<List<EmployeeDTO>>> {
        val employees = employeeService.getAllEmployees()
        val responseBody = ResponsePayload(
            message = "Employees retrieved successfully",
            status = HttpStatus.OK.reasonPhrase,
            body = employees
        )
        return ResponseEntity.ok(responseBody)
    }

    @GetMapping("employee/{id}")
    fun getEmployeeById(@PathVariable id: String): ResponseEntity<ResponsePayload<EmployeeDTO>> {
        val employee = employeeService.getEmployeeById(id)
        return if (employee != null) {
            val responseBody = ResponsePayload(
                message = "Employee retrieved successfully",
                status = HttpStatus.OK.reasonPhrase,
                body = employee
            )
            ResponseEntity.ok(responseBody)
        } else {
            val errorResponse = ResponsePayload<EmployeeDTO>(
                message = "Employee not found",
                status = HttpStatus.NOT_FOUND.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse)
        }
    }

    @PutMapping("employee/{id}")
    fun updateEmployee(
        @PathVariable id: String,
        @RequestBody updatedEmployee: EmployeeDTO
    ): ResponseEntity<ResponsePayload<Map<String, String>>> {
        employeeService.updateEmployee(id, updatedEmployee)
        val responseBody = ResponsePayload(
            message = "Employee updated successfully",
            status = HttpStatus.OK.reasonPhrase,
            body = mapOf("status" to HttpStatus.OK.reasonPhrase)
        )
        return ResponseEntity.ok(responseBody)
    }

    @DeleteMapping("employee/{id}")
    fun deleteEmployee(@PathVariable id: String): ResponseEntity<ResponsePayload<Map<String, String>>> {
        employeeService.deleteEmployee(id)
        val responseBody = ResponsePayload(
            message = "Employee deleted successfully",
            status = HttpStatus.OK.reasonPhrase,
            body = mapOf("status" to HttpStatus.OK.reasonPhrase)
        )
        return ResponseEntity.ok(responseBody)
    }

    @PostMapping("employee/profile/picture/{id}")
    fun uploadProfilePicture(
        @PathVariable id: String,
        @RequestParam file: MultipartFile
    ): ResponseEntity<ResponsePayload<Map<String, String>>> {
        return try {
            val message = employeeService.uploadProfilePicture(id, file)
            val responseBody = ResponsePayload(
                message = message,
                status = HttpStatus.OK.reasonPhrase,
                body = mapOf("status" to HttpStatus.OK.reasonPhrase)
            )
            ResponseEntity.status(HttpStatus.OK).body(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload(
                message = e.message ?: "Unknown error",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = mapOf("status" to HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase)
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }

    @GetMapping("employee/profile/picture/{id}")
    fun getProfilePicture(@PathVariable id: String): ResponseEntity<ResponsePayload<Map<String, String>>> {
        return try {
            val base64Image = employeeService.getProfilePicture(id)
            val responseBody = ResponsePayload(
                message = "Profile picture retrieved successfully",
                status = HttpStatus.OK.reasonPhrase,
                body = mapOf("profilePicture" to base64Image)
            )
            ResponseEntity.ok(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload(
                message = e.message ?: "Profile picture not found",
                status = HttpStatus.NOT_FOUND.reasonPhrase,
                body = mapOf("status" to HttpStatus.NOT_FOUND.reasonPhrase)
            )
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse)
        }
    }
}
