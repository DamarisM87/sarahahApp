export const authorization = (accessRoles = []) => {
    return (req, res, next) => {
        if (!accessRoles.includes(req?.user?.role)) {
            throw new Error("Unauthorized", { cause: 403 })
        }
        return next()
    }
}