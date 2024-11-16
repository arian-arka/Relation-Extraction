import env from "../env";

export default {
    'front': {
        'bases': {
            'default': env.base,
        },
        'urls': {
            'sample': '/sample',
            'sampleFun': (id: string) => `/sample/${id}`,
            'userLogin': `/user/login`,
            'userList': `/user/list`,
            'userStore' : `/user/store`,
            'userDashboard': `/user/dashboard`,
            'userUpdate':(id : string) => `/user/update/${id}`,

            'relationUpdate':(id : string) => `/relation/update/${id}`,
            'relationList' : `/relation/list`,
            'relationStore' : `/relation/store`,

            'sentenceList' : `/sentence/list`,
            'sentenceStore' : `/sentence/store`,
            'sentenceUpdate' : (sentence : string) => `/sentence/update/${sentence}`,
            'sentenceTag' : (sentence : string) => `/sentence/tag/${sentence}`,
        }
    },
    'back': {
        'bases': {
            'default': env.base,
        },

        'urls': {
            'csrf': `/csrf`,
            'userLogin': `/api/user/login`,
            'userList': `/api/user/list`,
            'userSelf': `/api/user/self`,
            'userLogout': `/api/user/logout`,
            'userUpdateProfile': `/api/user/profile`,
            'userGrant': `/api/user/grant`,
            'userShow': `/api/user`,
            'userStore': `/api/user`,
            'userUpdate': `/api/user`,
            'userDelete': `/api/user`,


            'relationList' : '/api/relation/list',
            'relationShow' : '/api/relation',
            'relationStore' : '/api/relation',
            'relationUpdate' : '/api/relation',
            'relationDestroy' : '/api/relation',


            'sentenceOpen' : `/api/sentence/open`,
            'sentenceStatus' : `/api/sentence/status`,
            'sentencePublish' : `/api/sentence/publish`,

            'sentenceList' : `/api/sentence/list`,
            'sentenceShow' : `/api/sentence`,
            'sentenceStore' : `/api/sentence`,
            'sentenceUpdate' : `/api/sentence`,
            'sentenceDestroy' : `/api/sentence`,
            'sentenceTag' : `/api/sentence/tag`,

            'reportEntitiesCount' : '/api/report/entitiesCount',
        }
    }
}