const userPermissions = ['uploadCv', 'getCv', 'updateUser', 'getRecommendation', 'getDetailedUserCv-user', 'saveAll', 'me']
const superAdminPermisions  = ['getAdmin','deleteAdmin', 'registerAdmin', 'addSection', 'deleteSection', 'me']
const adminPermisions = ['getCv','sendEmail','addAllRecommendation','getUserCv', 'getDetailedUserCv-admin', 'me']

module.exports = {
    userPermissions,
    adminPermisions,
    superAdminPermisions
}