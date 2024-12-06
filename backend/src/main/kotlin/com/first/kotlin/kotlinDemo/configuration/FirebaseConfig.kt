package com.first.kotlin.kotlinDemo.configuration

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.cloud.firestore.Firestore
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.FileInputStream
import io.github.cdimascio.dotenv.Dotenv
import java.io.ByteArrayInputStream
import java.util.*

@Configuration
class FirebaseConfig {

    @Bean
    fun firebaseApp(): FirebaseApp {

        val dotenv = Dotenv.load()
        val serviceAccountKey = dotenv["FIREBASE_SERVICE_ACCOUNT_KEY"]

        // Decode the base64 encoded Firebase service account key
        val decodedJson = String(Base64.getDecoder().decode(serviceAccountKey))
        val serviceAccount = ByteArrayInputStream(decodedJson.toByteArray())
        val options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setDatabaseUrl("https://fir-mobileapp-6b7d4.firebaseio.com")
            .build()

        return FirebaseApp.initializeApp(options)
    }

    @Bean
    fun firestore(firebaseApp: FirebaseApp): Firestore {
        return com.google.firebase.cloud.FirestoreClient.getFirestore(firebaseApp)
    }
}
