package com.first.kotlin.kotlinDemo.service

import com.first.kotlin.kotlinDemo.Utility.RoleConstants
import com.first.kotlin.kotlinDemo.domain.Role
import com.first.kotlin.kotlinDemo.exception.InvalidRequestException
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Service

@Service
class RoleService(private val firestore: Firestore) {

    private val collection = "roles"

    fun createRoles(roles: List<Role>): List<Map<String, String>> {
        val invalidRoles = roles.filter { it.name !in RoleConstants.VALID_ROLES }.map { it.name }

        if (invalidRoles.isNotEmpty()) {
            throw InvalidRequestException("Invalid roles: ${invalidRoles.joinToString(", ")}")
        }

        val existingRoleNames =
            firestore.collection(collection).get().get().documents.mapNotNull { it.toObject(Role::class.java)?.name }
                .toSet()

        val newRoles = roles.filter { it.name !in existingRoleNames }

        if (newRoles.isEmpty()) {
            throw InvalidRequestException("All roles already exist in the database.")
        }

        return newRoles.map { role ->
            val document = firestore.collection(collection).document()
            document.set(role).get()
            mapOf(
                "id" to document.id, "name" to role.name, "description" to role.description
            )
        }
    }
}

