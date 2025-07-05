// logger.js
import axios from "axios";

const BASE_URL = "http://20.244.56.144/evaluation-service/logs";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjE0MDEwMzNAcmFqYWxha3NobWkuZWR1LmluIiwiZXhwIjoxNzUxNjk0MTc0LCJpYXQiOjE3NTE2OTMyNzQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0ZDRmZjE5OC00Y2Q5LTQyZDUtYTIxMy03ODRjMWU2MDBiZDUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYWJlbGFuIGUiLCJzdWIiOiI4MDIyYzdkOS1kMjdhLTRmMTgtOWVmMS02OWMwYTZlYzk4YzYifSwiZW1haWwiOiIyMjE0MDEwMzNAcmFqYWxha3NobWkuZWR1LmluIiwibmFtZSI6ImthYmVsYW4gZSIsInJvbGxObyI6IjIyMTQwMTAzMyIsImFjY2Vzc0NvZGUiOiJjV3lhWFciLCJjbGllbnRJRCI6IjgwMjJjN2Q5LWQyN2EtNGYxOC05ZWYxLTY5YzBhNmVjOThjNiIsImNsaWVudFNlY3JldCI6Im5FYWNXQktQdGtGVk1TRlYifQ._74_3l-sTjqUKq0WiRsl7jP-BH8S4vL8w9sqqMWJ1F8"; // Replace with your real token

export async function Log(stack, level, pkg, message) {
  try {
    const res = await axios.post(
      BASE_URL,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Log sent:", res.data);
  } catch (err) {
    console.error("❌ Log failed:", err.response?.data || err.message);
  }
}
