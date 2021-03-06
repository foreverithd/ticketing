import axios from 'axios'
import { useState } from 'react'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const getErrorBlock = (error) => (
    <div className="alert alert-danger">
      <h4>Ooops....</h4>
      <ul className="my-0">
        {error.map((err) => (
          <li key={err.message}>{err.message}</li>
        ))}
      </ul>
    </div>
  )

  const doRequest = async () => {
    try {
      setErrors(null)
      const res = await axios[method](url, body)

      if (onSuccess) onSuccess(res.data)

      return res.data
    } catch (error) {
      setErrors(getErrorBlock(error.response.data.errors))
    }
  }

  return {
    doRequest,
    errors,
  }
}

export default useRequest
