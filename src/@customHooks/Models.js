import {useState, useEffect} from 'react';
import * as THREE from 'three';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';

const useStl = (url) => {
  const [data,setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function _base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/model')
      const json = await response.json();
      
      const loader = new STLLoader();
      const geometry = loader.parse(_base64ToArrayBuffer(json.data));
      setData(geometry);
      setLoading(false);
    } catch(e) {
      setError(e);
    }
  }

  useEffect(() => {
    fetchData();
  }, [url])
  return [data, loading, error];
}

export {useStl}

