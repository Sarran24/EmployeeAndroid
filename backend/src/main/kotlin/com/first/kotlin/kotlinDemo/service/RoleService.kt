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
            role.isActive = true
            val document = firestore.collection(collection).document()
            document.set(role).get()

            RoleMapper.toDTO(role.copy(id = document.id)) // Use the mapper for conversion
        }
    }

    fun getRolesByDepartmentId(departmentId: String): List<RoleDTO> {
        val roles = firestore.collection(collection)
            .whereEqualTo("departmentId", departmentId)
            .whereEqualTo("isActive", true)
            .get()
            .get()
            .documents
            .mapNotNull { document ->
                document.toObject(Role::class.java)?.copy(id = document.id) // Attach document ID
            }

        return roles.map(RoleMapper::toDTO)
    }

    fun updateRole(roleId: String, updatedRoleDTO: RoleDTO): RoleDTO {
        val document = firestore.collection(collection).document(roleId).get().get()

        if (!document.exists()) {
            throw InvalidRequestException("Role with ID $roleId does not exist.")
        }

        if (updatedRoleDTO.name !in RoleConstants.VALID_ROLES) {
            throw InvalidRequestException("Invalid role name: ${updatedRoleDTO.name}")
        }

        val existingRole = document.toObject(Role::class.java) ?: throw InvalidRequestException("Role data is invalid.")

        val updatedRole = existingRole.copy(
            name = updatedRoleDTO.name,
            description = updatedRoleDTO.description
        )

        firestore.collection(collection).document(roleId).set(updatedRole).get()

        return RoleMapper.toDTO(updatedRole.copy(id = roleId))
    }

    fun deleteRole(roleId: String) {
        val document = firestore.collection(collection).document(roleId).get().get()

        if (!document.exists()) {
            throw InvalidRequestException("Role with ID $roleId does not exist.")
        }

        firestore.collection(collection).document(roleId).delete().get()
    }

    fun getRoleById(roleId: String): RoleDTO {
        val document = firestore.collection(collection).document(roleId).get().get()

        if (!document.exists()) {
            throw InvalidRequestException("Role with ID $roleId does not exist.")
        }

        val role = document.toObject(Role::class.java)?.copy(id = document.id)
            ?: throw InvalidRequestException("Role data is invalid.")

        return RoleMapper.toDTO(role)
    }

}
