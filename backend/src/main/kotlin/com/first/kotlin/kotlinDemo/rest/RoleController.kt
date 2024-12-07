package com.first.kotlin.kotlinDemo.rest

import com.first.kotlin.kotlinDemo.dto.RoleDTO
import com.first.kotlin.kotlinDemo.exception.InvalidRequestException
import com.first.kotlin.kotlinDemo.service.RoleService
import com.first.kotlin.kotlinDemo.payload.ResponsePayload
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class RoleController(private val roleService: RoleService) {

    @PostMapping("/roles")
    fun createRoles(
        @RequestBody roles: List<RoleDTO>,
        @RequestParam departmentId: String
    ): ResponseEntity<ResponsePayload<List<RoleDTO>>> {
        return try {
            val createdRoles = roleService.createRoles(roles, departmentId) // Use the updated method
            val responseBody = ResponsePayload(
                message = "Roles created successfully",
                status = HttpStatus.CREATED.reasonPhrase,
                body = createdRoles
            )
            ResponseEntity.status(HttpStatus.CREATED).body(responseBody)
        } catch (e: InvalidRequestException) {
            val errorResponse = ResponsePayload<List<RoleDTO>>(
                message = e.message ?: "Invalid roles provided",
                status = HttpStatus.BAD_REQUEST.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<List<RoleDTO>>(
                message = e.message ?: "Unknown error",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }


    @GetMapping("roles/department")
    fun getRolesByDepartmentId(@RequestParam departmentId: String): ResponseEntity<ResponsePayload<List<RoleDTO>>> {
        return try {
            val roles = roleService.getRolesByDepartmentId(departmentId)
            val responseBody = ResponsePayload(
                message = "Roles retrieved successfully",
                status = HttpStatus.OK.reasonPhrase,
                body = roles
            )
            ResponseEntity.status(HttpStatus.OK).body(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<List<RoleDTO>>(
                message = e.message ?: "Error retrieving roles",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }
}
