package com.first.kotlin.kotlinDemo.mapper

import com.first.kotlin.kotlinDemo.domain.Employee
import com.first.kotlin.kotlinDemo.dto.EmployeeDTO

object EmployeeMapper {

    fun toDTO(employee: Employee): EmployeeDTO {
        return EmployeeDTO(
            id = employee.id,
            name = employee.name,
            position = employee.position,
            salary = employee.salary,
            profilePicture = employee.profilePicture,
            isActive = employee.isActive,
            departmentId = employee.departmentId,
            roleId = employee.roleId
        )
    }

    fun toEntity(employeeDTO: EmployeeDTO): Employee {
        return Employee(
            id = employeeDTO.id,
            name = employeeDTO.name,
            position = employeeDTO.position,
            salary = employeeDTO.salary,
            profilePicture = employeeDTO.profilePicture,
            isActive = employeeDTO.isActive,
            departmentId = employeeDTO.departmentId,
            roleId = employeeDTO.roleId
        )
    }
}
