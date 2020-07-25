import { useState } from 'react'

const useForm = callback => {
  const [inputs, setInputs] = useState({})

  const handleSubmit = event => {
    if (event) {
      event.preventDefault()
    }
    callback()
  }

  const handleChange = event => {
    event.persist()
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }))
  }
  return {
    handleSubmit,
    handleChange,
    inputs,
  }
}

/// Implementation
//
// const SignUp = () => {
//   const signup = () => {
//     const req = {...inputs}
//     alert(JSON.stringify(req))
//   }
//   const {inputs, handleChange, handleSubmit} = useForm(signup);
//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>First Name</label>
//         <input type="text" name="firstName" onChange={handleChange} value={inputs.firstName} required></input>
//         <label>Last Name</label>
//         <input type="text" name="lastName" onChange={handleChange} value={inputs.lastName} required></input>
//       </div>
//       <div>
//         <label>Email Address</label>
//         <input type="email" name="email" onChange={handleChange} value={inputs.email} required></input>
//       </div>
//       <div>
//         <label>Password</label>
//         <input type="password" name="password" onChange={handleChange} value={inputs.password} required></input>
//       </div>
//       <button type="submit">SignUp</button>
//     </form>
//   )
// }
export { useForm }
