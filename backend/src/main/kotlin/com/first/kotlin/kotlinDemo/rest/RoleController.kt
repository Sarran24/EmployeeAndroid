package com.first.kotlin.kotlinDemo.rest

import com.first.kotlin.kotlinDemo.domain.Role
import com.first.kotlin.kotlinDemo.exception.InvalidRequestException
import com.first.kotlin.kotlinDemo.service.RoleService
import com.first.kotlin.kotlinDemo.payload.ResponsePayload
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api")
class RoleController(private val roleService: RoleService) {

    @PostMapping("/roles")
    fun createRoles(@RequestBody roles: List<Role>): ResponseEntity<ResponsePayload<List<Map<String, String>>>> {
        return try {
            val createdRoleIds = roleService.createRoles(roles)
            val responseBody = ResponsePayload(
                message = "Roles created successfully",
                status = HttpStatus.CREATED.reasonPhrase,
                body = createdRoleIds
            )
            ResponseEntity.status(HttpStatus.CREATED).body(responseBody)
        } catch (e: InvalidRequestException) {
            val errorResponse = ResponsePayload<List<Map<String, String>>>(
                message = e.message ?: "Invalid roles provided",
                status = HttpStatus.BAD_REQUEST.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
        } catch (e: Exception) {
            val errorResponse = ResponsePayload<List<Map<String, String>>>(
                message = e.message ?: "Unknown error",
                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
                body = null
            )
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
        }
    }


//    @GetMapping("/roles/{id}")
//    fun getRoleById(@PathVariable id: String): ResponseEntity<ResponsePayload<Role>> {
//        return try {
//            // Assuming that the RoleService provides a method to get a role by its ID
//            val role = roleService.getRoleById(id)
//            val responseBody = ResponsePayload(
//                message = "Role retrieved successfully",
//                status = HttpStatus.OK.reasonPhrase,
//                body = role
//            )
//            ResponseEntity.ok(responseBody)
//        } catch (e: ResponseStatusException) {
//            val errorResponse = ResponsePayload<Role>(
//                message = e.message ?: "Role not found",
//                status = e.statusCode.toString(),
//                body = null
//            )
//            ResponseEntity.status(e.statusCode).body(errorResponse)
//        } catch (e: Exception) {
//            val errorResponse = ResponsePayload<Role>(
//                message = e.message ?: "Unknown error",
//                status = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
//                body = null
//            )
//            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
//        }
//    }
}
