import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard(){
    const navigate = useNavigate();
    
    function handleBack() {
        navigate(-1);
    }

    return(
        <main>
            <button onClick={handleBack}>← Back</button>
            <h1>Dashboard</h1>
            <h2>Welcome to Career Companion</h2>
            <h3>Your AI-Powered Career Assistant</h3>
            <p>Empowering your professional growth with intelligent guidance and insights.</p>
        </main>
    )
}

export default Dashboard;