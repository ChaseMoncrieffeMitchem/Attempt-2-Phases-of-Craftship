import React, { useState } from "react";
import { Layout } from "../components/layout";
import {
  RegistrationForm,
  RegistrationInput,
  api,
} from "../components/registrationForm";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice";

function Register() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  type ValidationResult = {
    success: boolean;
  }

  const validateForm = (input: RegistrationInput): ValidationResult => {
    // Basic validation checks
    const { email, username, firstName, lastName } = input;
    if (!email || !username || !firstName || !lastName) {
      toast.error("All fields are required");
      return { success: false };
    }
    // Add more specific validation if needed, e.g., email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email address");
      return { success: false };
    }
    // Username a certain length
    if (input.username.length < 3) {
      toast.error("Username must be greater than 3 characters")
      return { success: false } 
    }
    return { success: true };
  };

  

  const handleSubmitRegistrationForm = async (input: RegistrationInput) => {
    // Validate the form        // If the form is invalid      // Show an error toast (for invalid input)
    // If the form is valid, start isLoading    // Make the API call      // If the API call is successful        // Save the user details to the cache        // Stop the spinner        // Show the toast        // In 3 seconds, redirect to the main page           // If the call failed        // Stop the spinner        // Show the toast (for unknown error)
    const validationResult = validateForm(input);
    

  if (!validationResult.success) {
    toast.error("Validation failed");
    return;
  }

  setIsLoading(true);
  try {
    const result = await api.register(input);

    if (result.success) {
      // Handle successful registration
      toast.success("Registration successful! Redirecting...");
      dispatch(setUserDetails({ username: input.username, email: input.email, firstName: input.firstName, lastName: input.lastName, isLoggedIn: true}))
      setTimeout(() => {
        router.push('/'); // Redirect to the main page
      }, 3000); // Wait for 3 seconds before redirecting
    } else {
      // Handle registration error
      toast.error(result.errorMessage);
    }

  } catch (error) {
    // Handle unexpected errors
    toast.error("An unexpected error occurred. Please try again.");
  } finally {
    setIsLoading(false); // Stop loading spinner
  }
  };
  
  return (
    <Layout>
        <RegistrationForm onSubmit={(input: RegistrationInput) => {handleSubmitRegistrationForm(input)}}/>
    </Layout>
  );
};

export default Register