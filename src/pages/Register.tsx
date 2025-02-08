import { useState } from "react";
import { signUp } from "../redux/auth/authActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { Button, Form, Input } from "@heroui/react";
import { EyeSlashFilledIcon } from "../components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../components/icons/EyeFilledIcon";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  //const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!data.username) {
      setError({ username: "Please enter your user" });
      return;
    }

    if (!data.email) {
      setError({ email: "Please enter your Email" });
      return;
    }
    if (!data.password) {
      setError({ password: "Please enter your Password" });
      return;
    }

    try {
      if (username) {
        const isLogged = await dispatch(
          signUp(username, email, password, "user")
        );
        if (isLogged) {
          window.location.href = "/home";
        }
      } else {
        console.error("No user selected");
      }
    } catch (err) {
      console.error("Sign-up failed: ", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[95%] sm:max-w-md w-fullrounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Sign Up</h2>
        </div>

        <Form
          className="space-y-6"
          onSubmit={handleSignup}
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
              label="Email"
              name="email"
              radius="full"
              value={email}
              onValueChange={setEmail}
              placeholder="Enter your Email"
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
            Sign Up
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
