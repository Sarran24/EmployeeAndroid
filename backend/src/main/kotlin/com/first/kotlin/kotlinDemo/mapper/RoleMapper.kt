package com.first.kotlin.kotlinDemo.mapper

import com.first.kotlin.kotlinDemo.domain.Role
import com.first.kotlin.kotlinDemo.dto.RoleDTO

object RoleMapper {
    fun toDTO(role: Role): RoleDTO {
        return RoleDTO(
            id = role.id, name = role.name, description = role.description
        )
    }

    fun toEntity(roleDTO: RoleDTO, departmentId: String): Role {
        return Role(
            name = roleDTO.name, description = roleDTO.description, departmentId = departmentId
        )
    }
}
