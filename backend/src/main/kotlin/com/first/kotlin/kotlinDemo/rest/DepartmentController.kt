package com.first.kotlin.kotlinDemo.rest

import com.first.kotlin.kotlinDemo.domain.Department
import com.first.kotlin.kotlinDemo.dto.DepartmentDTO
import com.first.kotlin.kotlinDemo.payload.ResponsePayload
import com.first.kotlin.kotlinDemo.service.DepartmentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api")
class DepartmentController(private val departmentService: DepartmentService) {

    @GetMapping("/departments")
    fun getAllActiveDepartments(): ResponseEntity<ResponsePayload<List<DepartmentDTO>>> {
        return try {
            val activeDepartments = departmentService.getActiveDepartments()
            val responseBody = ResponsePayload(
                message = "Departments retrieved successfully",
                status = HttpStatus.OK.reasonPhrase,
                body = activeDepartments
            )
            ResponseEntity.ok(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<List<DepartmentDTO>>(
                message = e.message ?: "Unknown error",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)  // Return the error response
        }
    }


    @PostMapping("/departments")
    fun createDepartments(@RequestBody departments: List<Department>): ResponseEntity<ResponsePayload<List<Map<String, String>>>> {
        return try {
            val createdDepartments = departmentService.createDepartments(departments)

            val responseBody = ResponsePayload(
                message = "Departments created successfully",
                status = HttpStatus.CREATED.reasonPhrase,
                body = createdDepartments
            )

            ResponseEntity.status(HttpStatus.CREATED).body(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<List<Map<String, String>>>(
                message = e.message ?: "Unknown error",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }


    @GetMapping("/department/{id}")
    fun getDepartmentById(@PathVariable id: String): ResponseEntity<ResponsePayload<DepartmentDTO>> {
        return try {
            val department = departmentService.getDepartmentById(id)
            val responseBody = ResponsePayload(
                message = "Department retrieved successfully",
                status = HttpStatus.OK.getReasonPhrase(),
                body = department
            )
            ResponseEntity.ok(responseBody)
        } catch (e: ResponseStatusException) {
            val errorResponse = ResponsePayload<DepartmentDTO>(
                message = e.message ?: "Department not found", status = e.statusCode.toString(), body = null
            )
            ResponseEntity.status(e.statusCode).body(errorResponse)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<DepartmentDTO>(
                message = e.message ?: "Unknown error",
                status = HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }

    @PutMapping("/department")
    fun updateDepartment(
        @PathVariable id: String, @RequestBody updatedDepartment: DepartmentDTO
    ): ResponseEntity<ResponsePayload<DepartmentDTO>> {
        return try {
            val updatedDept = departmentService.updateDepartment(updatedDepartment)
            val responseBody = ResponsePayload(
                message = "Department updated successfully", status = HttpStatus.OK.reasonPhrase, body = updatedDept
            )
            ResponseEntity.ok(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<DepartmentDTO>(
                message = e.message ?: "Unknown error",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }

    @DeleteMapping("/department/{id}")
    fun softDeleteDepartment(@PathVariable id: String): ResponseEntity<ResponsePayload<Any>> {
        return try {
            departmentService.softDeleteDepartment(id)
            val responseBody = ResponsePayload<Any>(
                message = "Department deactivated successfully", status = HttpStatus.OK.reasonPhrase, body = null
            )
            ResponseEntity.ok(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<Any>(
                message = e.message ?: "Department not found", status = HttpStatus.NOT_FOUND.reasonPhrase, body = null
            )
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse)
        }
    }
}
