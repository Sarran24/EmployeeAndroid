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
            val createdRoles = roleService.createRoles(roles, departmentId)
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

    @PutMapping("/roles/{roleId}")
    fun updateRole(
        @PathVariable roleId: String,
        @RequestBody updatedRoleDTO: RoleDTO
    ): ResponseEntity<ResponsePayload<RoleDTO>> {
        return try {
            val updatedRole = roleService.updateRole(roleId, updatedRoleDTO)
            val responseBody = ResponsePayload(
                message = "Role updated successfully",
                status = HttpStatus.OK.reasonPhrase,
                body = updatedRole
            )
            ResponseEntity.status(HttpStatus.OK).body(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<RoleDTO>(
                message = e.message ?: "Error updating role",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }

    @DeleteMapping("/roles/{roleId}")
    fun deleteRole(@PathVariable roleId: String): ResponseEntity<ResponsePayload<Void>> {
        return try {
            roleService.deleteRole(roleId)
            val responseBody = ResponsePayload<Void>(
                message = "Role deleted successfully",
                status = HttpStatus.NO_CONTENT.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.NO_CONTENT).body(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<Void>(
                message = e.message ?: "Error deleting role",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }

    @GetMapping("/roles/{roleId}")
    fun getRoleById(@PathVariable roleId: String): ResponseEntity<ResponsePayload<RoleDTO>> {
        return try {
            val role = roleService.getRoleById(roleId)
            val responseBody = ResponsePayload(
                message = "Role retrieved successfully",
                status = HttpStatus.OK.reasonPhrase,
                body = role
            )
            ResponseEntity.status(HttpStatus.OK).body(responseBody)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<RoleDTO>(
                message = e.message ?: "Error retrieving role",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }
}
