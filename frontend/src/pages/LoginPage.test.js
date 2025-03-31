import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

test("renders login form and handles input", () => {
    // mock function to simulate login
  const loginMock = jest.fn();

  //render login page component in test DOM.
  render(
    <AuthContext.Provider value={{ login: loginMock }}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthContext.Provider>
  );

  const emailInput = screen.getByLabelText(/email address/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole("button", { name: /login/i });

  //  typing into the email and password fields
  fireEvent.change(emailInput, { target: { value: "user@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "mypassword" } });

  expect(emailInput.value).toBe("user@example.com");
  expect(passwordInput.value).toBe("mypassword");
});
