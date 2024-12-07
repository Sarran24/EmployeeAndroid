package com.first.kotlin.kotlinDemo.domain

import com.google.cloud.firestore.annotation.PropertyName
data class Role(
    @PropertyName("name") var name: String = "",
    @PropertyName("description") var description: String = "",
    @field:PropertyName("id") var id: String? = null,
    @PropertyName("departmentId") var departmentId: String = ""
)
