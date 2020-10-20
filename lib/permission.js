const userPermissions = ['uploadCv', 'getCv', 'updateUser', 'getRecommendation', 'getDetailedUserCv', 'saveAll']
const superAdminPermisions  = ['getAdmin','deleteAdmin', 'registerAdmin', 'addSection', 'deleteSection']
const adminPermisions = ['getCv','addAllRecommendation','getUserCv', 'getDetailedUserCv']

module.exports = {
    userPermissions,
    adminPermisions,
    superAdminPermisions
}