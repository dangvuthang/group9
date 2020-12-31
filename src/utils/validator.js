export default function checkInput(name, value) {
  if (name === "studentName") {
    if (value.length === 0) return "Name is required";
  }
  if (name === "message") {
    if (value.length === 0) return "Message is required";
    if (value.length < 8)
      return "Message's length should be at least 8 characters";
  }
}
