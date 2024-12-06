package com.first.kotlin.kotlinDemo.configuration

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.cloud.firestore.Firestore
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.FileInputStream

@Configuration
class FirebaseConfig {

    @Bean
    fun firebaseApp(): FirebaseApp {
        val serviceAccount = FileInputStream("src/main/resources/fir-mobileapp-6b7d4-firebase-adminsdk-go1g2-b8c1540d1b.json")

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
