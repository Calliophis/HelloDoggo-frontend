export interface PasswordRule {
    key: string;
    label: string;
    check: (value: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
    {
        key: 'minLength',
        label: '8 characters',
        check: (value) => value.length >= 8
    },
    {
        key: 'upperCase',
        label: 'One uppercase letter',
        check: (value) => /[A-Z]+/.test(value)
    },{
        key: 'lowerCase',
        label: 'One lowercase letter',
        check: (value) => /[a-z]+/.test(value)
    },{
        key: 'number',
        label: 'One number',
        check: (value) => /[0-9]+/.test(value)
    },{
        key: 'specialCharacter',
        label: 'One special character',
        check: (value) => /[!@#$%^&*]+/.test(value)
    },
]