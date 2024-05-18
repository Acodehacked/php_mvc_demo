<?php

namespace app\core;

abstract class Model
{
    public const RULE_REQUIRED = 'required';
    public const RULE_EMAIL = 'email';
    public const RULE_MIN = 'min';
    public const RULE_MAX = 'max';
    public const RULE_MATCH = 'match';
    public const RULE_SELECT = 'select';

    public function loadData($data)
    {
        foreach ($data as $key => $value){
            if(property_exists($this,$key)){
                $this->{$key} = $value;
            }
        }

    }
    public array $errors=[];
    abstract public function rules(): array;
    abstract public function labels(string $attribute) :string;
    public function validate()
    {
        foreach ($this->rules() as $attribute => $rules) {
            $value = $this->{$attribute};
            foreach ($rules as $rule){
                $ruleName = $rule;
                if(!is_string($ruleName)){
                    $ruleName = $rule[0];
                }
                if($ruleName === self::RULE_REQUIRED && !$value){
                    $this->AddErrorForRule($attribute, self::RULE_REQUIRED);
                }
                if($ruleName === self::RULE_EMAIL && !filter_var($value , FILTER_VALIDATE_EMAIL)){
                    $this->AddErrorForRule($attribute,self::RULE_EMAIL);
                }
                if($ruleName === self::RULE_MIN && strlen($value) <= $rule['min']){
                    $this->AddErrorForRule($attribute,self::RULE_MIN, $rule);
                }
                if($ruleName === self::RULE_MAX && strlen($value) >= $rule['max']){
                    $this->AddErrorForRule($attribute,self::RULE_MAX, $rule);
                }
                if($ruleName === self::RULE_MATCH && $value !== $this->{$rule['match']}){
                    $this->AddErrorForRule($attribute,self::RULE_MATCH, $rule);
                }
                if($ruleName === self::RULE_SELECT && $value === 0){
                    $this->AddErrorForRule($attribute,self::RULE_MATCH, $rule);
                }
            }
        }
        return empty($this->errors);
    }

    private function AddErrorForRule($attr, string $rule, $params = [])
    {
        $message = $this->errorMessages()[$rule] ?? '';
        foreach ($params as $key => $value){
            $message = str_replace("{{$key}}", $value,$message);
        }
        $this->errors[$attr][] = $message;
    }
    public function addError(string $attribute,string $message){
        $this->errors[$attribute][] = $message;
    }
    public function errorMessages()
    {
        return [
            self::RULE_REQUIRED => "This field is Required",
            self::RULE_EMAIL => "This field must be a valid Email Address",
            self::RULE_MATCH => 'This field must be the same as {match}',
            self::RULE_SELECT => 'Please Select any of these options',
            self::RULE_MIN => 'Min length of this field must be {min}',
            self::RULE_MAX => 'Max length of this field must be {max}',
        ];
    }

    public function hasError($attribute)
    {
        return $this->errors[$attribute] ?? false;
    }

    public function getFirstError($attribute)
    {
        return $this->errors[$attribute][0] ?? false;
    }
}