import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

export type RegistrationInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};

interface RegistrationFormProps {
  onSubmit: (formDetails: RegistrationInput) => void;
}

export const api = {
  register: async (input: RegistrationInput) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/users/new",
        input
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        }
      } else {
        
        return {
          success: false,
          errorMessage: response.data.error
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return {
          success: false,
          errorMessage: error.response.data.error || "Unknown error"
        };
      } else {
        return {
          success: false,
          errorMessage: "Unknown Error"
        }
      }
      }
  },

  fetchPosts: async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts', {
        params: {sort : 'recent'}
      });
  
      if (response.data.success && response.data.data?.posts) {
        return {
          success: true,
          data: response.data.data.posts,
        };
      } else {
        return {
          success: false,
          errorMessage: response.data.error,
        };
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return {
          success: false,
          errorMessage: error.response.data.error || "Unknown error",
        };
      } else {
        return {
          success: false,
          errorMessage: "Unknown Error",
        };
      }
    }
  },
};

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<RegistrationInput>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div>Create Account</div>
      <input
        className="registration email"
        type="email"
        placeholder="email"
        onChange={handleChange}
        name="email"
        value={formData.email}
      ></input>
      <input
        className="registatation-input username"
        type="text"
        placeholder="username"
        onChange={handleChange}
        name="username"
        value={formData.username}
      ></input>
      <input
        className="registatation-input username"
        type="text"
        placeholder="first name"
        onChange={handleChange}
        name="firstName"
        value={formData.firstName}
      ></input>
      <input
        className="registatation-input username"
        type="text"
        placeholder="last name"
        onChange={handleChange}
        name="lastName"
        value={formData.lastName}
      ></input>
      <div>
        <div className="to-login">
          <div>Already have an account?</div>
          <Link href="/login">Login</Link>
        </div>
        <button className="submit-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
