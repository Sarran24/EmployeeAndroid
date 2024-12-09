import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import { createEmployee } from './api';
import Icon from 'react-native-vector-icons/AntDesign';
import blankProfilePicture from '../assets/images/blank-profile-picture.png';
import * as ImagePicker from 'expo-image-picker';

const CreateEmployeeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [profilePicture, setProfilePicture] = useState('')


    const handleCreateEmployee = async () => {
        // Basic validation
        if (!name || !position || !salary) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            // Create the new employee object with the required fields
            const newEmployee = await createEmployee({
                id: '',
                name,
                position,
                salary: parseFloat(salary),
                profilePicture,
                isActive: true,
                departmentId: null,
                roleId: null,
            });

            Alert.alert('Success', 'Employee created successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to create employee');
            console.error(error);
        }
    };


    const handleImageSelect = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access the gallery is required!');
            return;
        }

        // Launch the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            base64: true, // Ensure base64 data is included
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            console.log({ result })
            // Add the base64 string to the data URI format
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            console.log("Selected Image Base64:", base64Image); // Log the base64 image for debugging

            try {// Log the response 
                setProfilePicture(base64Image);
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            }
        } else {
            alert('You did not select any image.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Employee</Text>
            <View style={styles.profilePictureContainer}>
                <Image
                    source={profilePicture ? { uri: profilePicture } : blankProfilePicture}
                    style={styles.profilePicture}
                />
                <TouchableOpacity style={styles.addIconContainer} onPress={handleImageSelect}>
                    {/* Use the camera icon instead of + */}
                    <Icon name="camerao" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.updateForm}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Position"
                    value={position}
                    onChangeText={setPosition}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Salary"
                    value={salary}
                    onChangeText={setSalary}
                    keyboardType="numeric"
                />
            </View>



            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateEmployee}
            >
                <Text style={styles.buttonText}>Create Employee</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'white',
    },
    profilePictureContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 20,
        padding: 5,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    updateForm: {
        width: '90%',           // Or any width you'd like
        marginLeft: 'auto',     // These two properties center the element horizontally
        marginRight: 'auto',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CreateEmployeeScreen;