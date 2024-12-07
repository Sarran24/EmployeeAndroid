package com.first.kotlin.kotlinDemo.service

import com.first.kotlin.kotlinDemo.Utility.RoleConstants
import com.first.kotlin.kotlinDemo.domain.Role
import com.first.kotlin.kotlinDemo.dto.RoleDTO
import com.first.kotlin.kotlinDemo.exception.InvalidRequestException
import com.first.kotlin.kotlinDemo.mapper.RoleMapper
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Service

@Service
class RoleService(private val firestore: Firestore) {

    private val collection = "roles"

    fun createRoles(roleDTOs: List<RoleDTO>, departmentId: String): List<RoleDTO> {
        val invalidRoles = roleDTOs.filter { it.name !in RoleConstants.VALID_ROLES }.map { it.name }

        if (invalidRoles.isNotEmpty()) {
            throw InvalidRequestException("Invalid roles: ${invalidRoles.joinToString(", ")}")
        }

        val existingRoleNames = firestore.collection(collection).get().get().documents
            .mapNotNull { it.toObject(Role::class.java)?.name }
            .toSet()

        val newRoles = roleDTOs.filter { it.name !in existingRoleNames }

        if (newRoles.isEmpty()) {
            throw InvalidRequestException("All roles already exist in the database.")
        }

        return newRoles.map { dto ->
            val role = RoleMapper.toEntity(dto, departmentId)
            val document = firestore.collection(collection).document()
            document.set(role).get()

            RoleMapper.toDTO(role.copy(id = document.id)) // Use the mapper for conversion
        }
    }

    fun getRolesByDepartmentId(departmentId: String): List<RoleDTO> {
        val roles = firestore.collection(collection)
            .whereEqualTo("departmentId", departmentId)
            .get()
            .get()
            .documents
            .mapNotNull { document ->
                document.toObject(Role::class.java)?.copy(id = document.id) // Attach document ID
            }

        return roles.map(RoleMapper::toDTO)
    }
}
