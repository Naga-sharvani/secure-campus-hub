export function getRole(email){
    if(!email) return null;
    const e=email.toLowerCase().trim();

    if(e.endsWith("@stu")) return "student";
    else if(e.endsWith("@fac")) return "faculty";
    else if(e.endsWith("@admin")) return "admin";
    return null;
}