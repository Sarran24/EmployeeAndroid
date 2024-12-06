package com.first.kotlin.kotlinDemo.payload

data class ResponsePayload<T>(
    val message: String,
    val status: String,
    val body: T?
)
