package com.first.kotlin.kotlinDemo.domain
import com.google.cloud.firestore.annotation.PropertyName


data class Department(
    @PropertyName("name") var name: String = "",
    @PropertyName("location") var location: String = "",
    @PropertyName("budget") var budget: Double = 0.0,
    @PropertyName("isActive") var isActive: Boolean = true,
    @field:PropertyName("id") var id: String? = null
)
