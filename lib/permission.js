const userPermissions = ['uploadCv', 'getCv', 'updateUser', 'getRecommendation', 'getDetailedUserCv-user', 'saveAll']
const superAdminPermisions  = ['getAdmin','deleteAdmin', 'registerAdmin', 'addSection', 'deleteSection']
const adminPermisions = ['getCv','addAllRecommendation','getUserCv', 'getDetailedUserCv-admin']

module.exports = {
    userPermissions,
    adminPermisions,
    superAdminPermisions
}