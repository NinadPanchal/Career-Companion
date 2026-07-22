function LandingPage() {
    function handleClick() {
        console.log("Button Clicked");
    };

    return (
        <main>
            <h1>Career Companion</h1>
            <h2>AI-Powered Career Assistant.</h2>
            <button onClick={handleClick}>Get Started → </button>
        </main>

);
};
export default LandingPage;