import {Show} from "solid-js";
import Lang from "../Core/Helper/Lang";

export default {
    'en': {
        sentence: {
            status: {
                'unchanged': 'Unchanged',
                'published': 'Published',
                //waiting for agreement
                'editing': "Editing",
                'waiting': 'Waiting',
                'refused': 'Refused',
            },
        },
        app: {
            name: 'Relation Extraction',
        },

        items: {
            close: `بستن`,
        },

        'response': {
            '400': 'Bad request',
            'unreal': 'network error',
            'validation': 'validation error'
        },

        'menu': {
            'test': `test`
        },

        table: {
            limit: 'limit',
            header: {
                filterHeadingOpen: <>
                    <span>Filter</span>
                    <svg data-accordion-icon="" class="w-3 h-3 shrink-0" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 5 5 1 1 5"></path>
                    </svg>
                </>,
                filterHeadingClose: <>
                    <span>Filter</span>
                    <svg data-accordion-icon="" class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2" d="M9 5 5 1 1 5"></path>
                    </svg>
                </>
            },
            sideFilter: {
                header: `Filter`,
                applyButton: `Apply`,
                defaultButton: `Default`,
            },
            pagination: {
                showingOf: (props?: {
                    total?: number,
                    totalSoFar?: number,
                    limit?: number,

                }) => {
                    if (!props?.totalSoFar)
                        return '';
                    return <>
                        Showing
                        <Show when={props?.limit} fallback={
                            <span class="font-semibold text-gray-900 dark:text-white">{` ${props?.totalSoFar} `}</span>
                        }>
                            <span
                                class="font-semibold text-gray-900 dark:text-white">{` ${props?.totalSoFar - props?.limit + 1} - ${props?.totalSoFar} `}</span>
                        </Show>
                        <Show when={props?.total}>
                            of
                            <span class="font-semibold text-gray-900 dark:text-white">{` ${props?.total} `}</span>
                        </Show>
                    </>;
                }
            },
            paginationNumbers: (number = undefined, totalSoFar = undefined, total = undefined) => {
                if (!number || number == 0)
                    return '';
                if (totalSoFar && total)
                    return `Show ${number} | ${totalSoFar} of ${total}`
                return `Show ${number} `;
            },
            paginationLastPage: `last`,
            paginationFirstPage: `first`,
            paginationPrevious: `pre`,
            paginationNext: `next`,
        },

        'component': {
            'button': {
                'loading': <>
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"/>
                    </svg>
                    Loading...
                </>
            },
        },

        errors: {
            fields: {
                name: `name`,
                description: `description`,
                email: `email`,
                password: 'password',
            },
            string: {
                required: (field: string | number) => `${Lang.get('errors.fields.' + field)} is required.`,
                min: (field: string | number, number: number) => `${Lang.get('errors.fields.' + field)} must have at least ${number} characters.`,
                max: (field: string | number, number: number) => `${Lang.get('errors.fields.' + field)} must have at most ${number} characters.`,
                email: `Invalid email.`,
            },
            array: {
                required: (field: string | number) => `${Lang.get('errors.fields.' + field)} is empty.`,
            },
            boolean: {
                required: (field: string | number) => `${Lang.get('errors.fields.' + field)} is empty`,
            }
        },

        pages: {
            '404': {
                backToDashboard: 'Back to Homepage',
                sorry: `Sorry, we can't find that page. You'll find lots to explore on the home page.`,
                missing: `Something's missing.`,
            }
        },

        words: {
            taggedCount:'Tagged count',
            withRelations : 'With relations',
            withoutRelations : 'Without relations',
            newPage:  'New page',
            copy:`copy`,
            from:`from`,
            to:`to`,
            relationType:`Relation type`,

            makeRelation : `Make Relation`,
            makeEntity : `Make Entity`,
            words : `words`,
            wasSuccess : 'Operation was successful',
            close: 'Close',
            login: 'Login',
            signIn: 'Sign in',
            privileges: 'Privileges',
            dashboard: 'Dashboard',
            apps: 'Apps',
            language: 'Language',
            users: 'Users',
            relations: 'Relations',
            relation: 'Relation',
            sentences: 'Sentences',
            sentence: 'sentence',
            profile: 'Profile',
            logout: 'Logout',
            name: 'Name',
            email: 'Email',
            action: 'Action',
            user: 'User',
            create: 'Create',
            password: 'Password',
            newPassword: 'New password',
            store: 'Store',
            storeUser: 'Store user',
            updateUser: 'Update user',
            storeRelation: 'Store relation',
            updateRelation: 'Update relation',
            description: 'Description',
            delete: 'Delete',
            storeSentence: 'Store sentence',
            updateSentence: 'Update sentence',
            unchanged : `Unchanged`,
            published : `Published`,
            waiting : `Waiting`,
            release : `Release`,
            refused : `Refused`,
            editing : `Editing `,
            refuse : `Refuse `,
            publish : `Publish `,
            assign : `Assign`,
            checkSentence : `Check sentence`,
            status : 'Status',
        },

        placeholders: {
            nameOrEmail: 'Name or email ...',
            email: 'Email ...',
            name: 'Name ...',
            notRequired: 'Not required ... ',
            description: 'Description ...',
            words: 'words ...',
            wikipedia : 'wikipedia link...'
        },

        datetime: {
            fullDatetime: (d: Date) => d.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })
        },

        privileges: {
            'store user': 'Store user',
            'update user': 'Update user',
            'destroy user': 'Destroy user',
            'view user': 'View user',
            'view users': 'View users',


            'store relation': 'Store relation',
            'update relation': 'Update relation',
            'destroy relation': 'Destroy relation',
            'view relation': 'View relation',
            'view relations': 'View relations',

            'store sentence': 'Store sentence',
            'update sentence': 'Update sentence',
            'destroy sentence': 'Destroy sentence',
            'view sentence': 'View sentence',
            'view sentences': 'View sentences',
            'publish sentence': 'Publish sentences',
            'update sentence words' : 'Update sentence word',
        },

    },

    'fa': {
        sentence: {
            status: {
                'unchanged': 'بدون تغییر',
                'published': 'نهایی شده',
                //waiting for agreement
                'editing': "در حال ویرایش",
                'waiting': 'در انتظار بررسی',
                'refused': 'رد شده',
            },
        },
        'response': {
            '400': 'خطا',
            'unreal': 'خطا در شبکه',
            'validation': 'خطا'
        },

        app: {
            name: 'استخراج رابطه',
        },

        errors: {
            string: {
                required: (field: string | number) => `${field} لازم است`,
                min: (field: string | number, number: number) => `${field} حداقل ${number} تعداد کاراکتر دارد`,
                max: (field: string | number, number: number) => `${field} حداکثر ${number} تعداد کاراکتر دارد`,
                email: `ایمیل نا معتبر است`,
            },
            array: {
                required: (field: string | number) => `${field} خالی است`,
            },
            boolean: {
                required: (field: string | number) => `${field} خالی است`,
            }
        },
        'component': {
            'button': {
                'loading': <>
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"/>
                    </svg>
                    Loading...
                </>
            },
        },

        table: {
            limit: 'تعداد',
            header: {
                filterHeadingOpen: <>
                    <span>فیلتر</span>
                    <svg data-accordion-icon="" class="w-3 h-3 shrink-0" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 5 5 1 1 5"></path>
                    </svg>
                </>,
                filterHeadingClose: <>
                    <span>فیلتر</span>
                    <svg data-accordion-icon="" class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2" d="M9 5 5 1 1 5"></path>
                    </svg>
                </>
            },
            sideFilter: {
                header: `فیلتر`,
                applyButton: `ثبت`,
                defaultButton: `پیش فرض`,
            },
            pagination: {
                showingOf: (props?: {
                    total?: number,
                    totalSoFar?: number,
                    limit?: number,

                }) => {
                    if (!props?.totalSoFar)
                        return '';
                    return <>

                        <Show when={props?.limit} fallback={
                            <span class="font-semibold text-gray-900 dark:text-white">{` ${props?.totalSoFar} `}</span>
                        }>
                            <span
                                class="font-semibold text-gray-900 dark:text-white">{` ${props?.totalSoFar - props?.limit + 1} - ${props?.totalSoFar} `}</span>
                        </Show>
                        <Show when={props?.total}>
                            از
                            <span class="font-semibold text-gray-900 dark:text-white">{` ${props?.total} `}</span>
                        </Show>
                    </>;
                }
            },
            paginationNumbers: (number = undefined, totalSoFar = undefined, total = undefined) => {
                if (!number || number == 0)
                    return '';
                if (totalSoFar && total)
                    return `Show ${number} | ${totalSoFar} of ${total}`
                return `Show ${number} `;
            },
            paginationLastPage: `آخر`,
            paginationFirstPage: `اول`,
            paginationPrevious: `قبل`,
            paginationNext: `بعد`,
        },

        pages: {
            '404': {
                backToDashboard: 'بازگشت به خانه',
                sorry: `با عرض پورش، صفجه مورد نطر پیدا نشد.`,
                missing: ` `,
            }
        },

        words: {
            taggedCount:'تعداد برچسب',
            withRelations : 'با رابطه',
            withoutRelations : 'بدون رابطه',
            newPage:  'صفحه جدید',
            copy:`کپی`,
            from:`از`,
            to:`به`,
            relationType:`نوع رابطه`,

            makeRelation : `ساخت رابطه`,
            makeEntity : `ساخت موجودیت`,
            words : `کلمات`,
            wasSuccess : 'عملیات با موفقیت انجام شد',
            close: `بستن`,
            login: 'ورود',
            signIn: 'ورود',
            privileges: 'دسترسی ها',
            dashboard: 'داشبورد',
            apps: 'برنامه ها',
            language: 'زبان',
            users: 'کاربران',
            relations: 'رابطه ها',
            relation: 'رابطه',
            sentences: 'جمله ها',
            sentence: 'جمله',
            profile: 'پروفایل',
            logout: 'خروج',
            name: 'نام',
            email: 'ایمیل',
            action: ' ',
            user: 'کاربر',
            create: 'ساخت',
            password: 'رمز',
            newPassword: 'رمز جدید',
            store: 'ثبت',
            storeUser: 'ثبت کاربر',
            updateUser: 'ویرایش کاربر',
            storeRelation: 'ثبت رابطه',
            updateRelation: 'ویرایش رابطه',
            description: 'توضیحات',
            delete: 'حذف',
            storeSentence: 'ثبت جمله',
            updateSentence: 'ویرایش جمله',
            unchanged : `بدون تغییر`,
            published : `نهایی`,
            waiting : `در انتظار بررسی`,
            release : `آزاد سازی`,
            refused : `رد شده`,
            editing : `در حال ویرایش`,
            refuse : `رد `,
            publish : `نهایی `,
            assign : `انتساب`,
            checkSentence: `بررسی جمله`,
            status : 'وضعیت',
        },

        placeholders: {
            nameOrEmail: 'نام یا ایمیل...',
            email: 'ایمیل...',
            name: ' نام ...',
            notRequired: 'اجباری نیست ...',
            description: 'توضیحات ...',
            words: 'کلمه ها ...',
            wikipedia : 'لینک ویکیپدیا ...'
        },

        datetime: {
            fullDatetime: (d: Date) => d.toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })
        },

        privileges: {
            'store user': 'ساخت کاربر',
            'update user': 'ویرایش کاربر',
            'destroy user': 'حذف کاربر',
            'view user': 'مشاهده کاربر',
            'view users': 'مشاهده کاربران',


            'store relation': 'ساخت رابطه',
            'update relation': 'ویرایش رابطه',
            'destroy relation': 'حذف رابطه',
            'view relation': 'مشاهده رابطه',
            'view relations': 'مشاهده رابطه ها',

            'store sentence': 'ساخت جمله',
            'update sentence': 'ویرایش جمله',
            'destroy sentence': 'حذف جمله',
            'view sentence': 'مشاهده جمله',
            'view sentences': 'مشاهده جمله ها',
            'publish sentence': 'انتشار جمله ها',
            'update sentence words' : 'ویرایش متن جمله'
        },

    }
}