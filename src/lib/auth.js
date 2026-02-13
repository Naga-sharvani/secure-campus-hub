export function getRole(email){
    if(!email) return null;
    const e=email.toLowerCase().trim();

    if(e.endsWith("@stu.cbit")) return "student";
    else if(e.endsWith("@fac.cbit")) return "faculty";
    else if(e.endsWith("@admin.cbit")) return "admin";
    return null;
}