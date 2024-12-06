package com.first.kotlin.kotlinDemo.configuration

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.cloud.firestore.Firestore
import io.github.cdimascio.dotenv.Dotenv
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.ByteArrayInputStream
import java.util.Base64

@Configuration
class FirebaseConfig {

    @Bean
    fun firebaseApp(): FirebaseApp {
        // Load environment variables
        val dotenv = Dotenv.load()
        val serviceAccountKeyBase64 = dotenv["FIREBASE_SERVICE_ACCOUNT_KEY"]

        // Decode the Base64-encoded service account key JSON
        val serviceAccountKeyJson = String(Base64.getDecoder().decode(serviceAccountKeyBase64))
        val serviceAccountStream = ByteArrayInputStream(serviceAccountKeyJson.toByteArray())

        // Configure Firebase options
        val options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
            .setDatabaseUrl("https://fir-mobileapp-6b7d4.firebaseio.com")
            .build()

        // Initialize and return the Firebase App instance
        return FirebaseApp.initializeApp(options)
    }

    @Bean
    fun firestore(firebaseApp: FirebaseApp): Firestore {
        // Return Firestore instance associated with the Firebase App
        return com.google.firebase.cloud.FirestoreClient.getFirestore(firebaseApp)
    }
}
