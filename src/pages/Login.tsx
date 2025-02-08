import { useState } from "react";
import { signIn } from "../redux/auth/authActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { Button, Form, Input } from "@heroui/react";
import { EyeSlashFilledIcon } from "../components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../components/icons/EyeFilledIcon";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  //const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    console.log("data", data);
    if (!data.username) {
      setError({ user: "Please enter your username" });
      return;
    }

    if (!data.password) {
      setError({ password: "Please enter you password" });
      return;
    }

    try {
      if (username) {
        console.log("username", username);
        const isLogged = await dispatch(signIn(username, password, "user"));
        if (isLogged) {
          window.location.href = "/home";
        }
      } else {
        console.error("No user selected");
      }
    } catch (err) {
      console.error("Sign-in failed: ", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[95%] sm:max-w-md w-fullrounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Sign In</h2>
        </div>

        <Form
          className="space-y-6"
          onSubmit={handleSignin}
          validationErrors={error}
        >
          <div className="space-y-10 w-full">
            <Input
              label="Username"
              name="username"
              radius="full"
              value={username}
              onValueChange={setUsername}
              placeholder="Enter your username"
              labelPlacement="outside"
              variant="bordered"
              fullWidth
            />
            <Input
              label="Password"
              name="password"
              radius="full"
              type={isVisible ? "text" : "password"}
              value={password}
              onValueChange={setPassword}
              placeholder="Enter your password"
              labelPlacement="outside"
              variant="bordered"
              fullWidth
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
          </div>

          <Button
            className="w-full py-3"
            type="submit"
            color="warning"
            radius="full"
            fullWidth
          >
            Sign In
          </Button>
        </Form>
        <span className="text-center block mt-4 text-small">
          Don't have account?
          <a
            className="text-warning hover:cursor-pointer"
            onClick={() => navigate("/register")}
          >
            {" "}
            Sign Up
          </a>
        </span>
      </div>
    </div>
  );
};

export default Login;
