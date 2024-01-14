import  {createContext, useState, useContext, useEffect} from 'react'
import { registerRequest , loginRequest, verifyTokenRequest} from '../api/auth'
import Cookie from 'js-cookie'


export const AuthContext = createContext()


export const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context){
         throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [ isAuthenticated, setIsAuthenticated] = useState(false)
    const [ errors, setErrors] = useState([])
    const [ loading, setLoading] = useState(true)
    
      
    const signup = async (user) => {
       try {
        const res = await registerRequest(user)
        console.log(res.data);
        setUser(res.data)
        setIsAuthenticated(true)
       } catch (error) {
        console.log(error.response);
        setErrors(error.response.data)
       }
    }
    const signin =  async (user) => {
        try {
            // const res = await loginRequest(user)
            // console.log(res);
            // setIsAuthenticated(true)
            // setUser(user)

            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);

        } catch (error) {
            console.log(error);
            if ( Array.isArray(error.response.data)) {
                return setErrors(error.response.data)
            }
            setErrors([error.response.data.message])
            
        }
    }
    const logout = () => {
        Cookie.remove("token");
        setUser(null);
        setIsAuthenticated(false);
    };
    useEffect(()=>{
        if (errors.length > 0) {
         const timer =  setTimeout(() => {
             setErrors([])   
            }, 5000);
            return () => clearTimeout(timer)
        }
    },[errors])

    useEffect(()=>{
        
        async function checkLogin() {
            const cookie = Cookie.get()
            console.log(cookie);
            if (!cookie.token) {
              //  console.log(cookie.token);
                setIsAuthenticated(false)
                setLoading(false);
                return setUser(null);
               
            }
            try {
                const res =  await verifyTokenRequest(cookie.token)
                if(!res.data) {
                    setIsAuthenticated(false)
                    setLoading(false);
                    return;
                }
                setIsAuthenticated(true)
                setUser(res.data)
                setLoading(false);

                
                } catch (error) {
                    setIsAuthenticated(false)
                    setUser(null)
                    setLoading(false);
                }
        }
        checkLogin()
    },[])

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            logout,
            loading,
            user,
            isAuthenticated,
            errors
        }}>
              {children}
              
        </AuthContext.Provider>
    )
}