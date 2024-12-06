//package com.first.kotlin.kotlinDemo.configuration
//
//import com.google.firebase.cloud.FirestoreClient
//import com.google.cloud.firestore.Firestore
//import org.springframework.stereotype.Service
//import javax.annotation.PostConstruct
//
//@Service
//class FirestoreInitializationService {
//
//    private val firestore: Firestore = FirestoreClient.getFirestore()
//
//    @PostConstruct
//    fun initializeFirestoreCollections() {
//        val collections = mapOf(
//            "departments" to listOf(
//                mapOf("name" to "Default Department", "isActive" to true)
//            )
//        )
//
//        for ((collection, defaultDocs) in collections) {
//            val snapshot = firestore.collection(collection).get().get()
//            if (snapshot.isEmpty) {
//                defaultDocs.forEach { doc ->
//                    firestore.collection(collection).add(doc).get()
//                }
//                println("Initialized Firestore collection: $collection")
//            } else {
//                println("Collection '$collection' already initialized")
//            }
//        }
//    }
//}
