import { InputManager } from "./input.manager";
export class InputService {
    constructor(htmlInputElement, options) {
        this.htmlInputElement = htmlInputElement;
        this.options = options;
        this.inputManager = new InputManager(htmlInputElement);
    }
    addNumber(keyCode) {
        if (!this.rawValue) {
            this.rawValue = this.applyMask(false, "0");
        }
        let keyChar = String.fromCharCode(keyCode);
        let selectionStart = this.inputSelection.selectionStart;
        let selectionEnd = this.inputSelection.selectionEnd;
        this.rawValue = this.rawValue.substring(0, selectionStart) + keyChar + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart + 1);
    }
    applyMask(isNumber, rawValue) {
        let { allowNegative, decimal, precision, prefix, suffix, thousands } = this.options;
        rawValue = isNumber ? new Number(rawValue).toFixed(precision) : rawValue;
        let onlyNumbers = rawValue.replace(/[^0-9]/g, "");
        if (!onlyNumbers) {
            return "";
        }
        let integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision).replace(/^0*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
        if (integerPart == "") {
            integerPart = "0";
        }
        let newRawValue = integerPart;
        let decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);
        if (precision > 0) {
            decimalPart = "0".repeat(precision - decimalPart.length) + decimalPart;
            newRawValue += decimal + decimalPart;
        }
        let isZero = parseInt(integerPart) == 0 && (parseInt(decimalPart) == 0 || decimalPart == "");
        let operator = (rawValue.indexOf("-") > -1 && allowNegative && !isZero) ? "-" : "";
        return operator + prefix + newRawValue + suffix;
    }
    clearMask(rawValue) {
        if (rawValue == null || rawValue == "") {
            return null;
        }
        let value = rawValue.replace(this.options.prefix, "").replace(this.options.suffix, "");
        if (this.options.thousands) {
            value = value.replace(new RegExp("\\" + this.options.thousands, "g"), "");
        }
        if (this.options.decimal) {
            value = value.replace(this.options.decimal, ".");
        }
        return parseFloat(value);
    }
    changeToNegative() {
        if (this.options.allowNegative && this.rawValue != "" && this.rawValue.charAt(0) != "-" && this.value != 0) {
            let selectionStart = this.inputSelection.selectionStart;
            this.rawValue = "-" + this.rawValue;
            this.updateFieldValue(selectionStart + 1);
        }
    }
    changeToPositive() {
        let selectionStart = this.inputSelection.selectionStart;
        this.rawValue = this.rawValue.replace("-", "");
        this.updateFieldValue(selectionStart - 1);
    }
    fixCursorPosition(forceToEndPosition) {
        let currentCursorPosition = this.inputSelection.selectionStart;
        //if the current cursor position is after the number end position, it is moved to the end of the number, ignoring the prefix or suffix. this behavior can be forced with forceToEndPosition flag
        if (currentCursorPosition > this.getRawValueWithoutSuffixEndPosition() || forceToEndPosition) {
            this.inputManager.setCursorAt(this.getRawValueWithoutSuffixEndPosition());
            //if the current cursor position is before the number start position, it is moved to the start of the number, ignoring the prefix or suffix
        }
        else if (currentCursorPosition < this.getRawValueWithoutPrefixStartPosition()) {
            this.inputManager.setCursorAt(this.getRawValueWithoutPrefixStartPosition());
        }
    }
    getRawValueWithoutSuffixEndPosition() {
        return this.rawValue.length - this.options.suffix.length;
    }
    getRawValueWithoutPrefixStartPosition() {
        return this.value != null && this.value < 0 ? this.options.prefix.length + 1 : this.options.prefix.length;
    }
    removeNumber(keyCode) {
        let { decimal, thousands } = this.options;
        let selectionEnd = this.inputSelection.selectionEnd;
        let selectionStart = this.inputSelection.selectionStart;
        if (selectionStart > this.rawValue.length - this.options.suffix.length) {
            selectionEnd = this.rawValue.length - this.options.suffix.length;
            selectionStart = this.rawValue.length - this.options.suffix.length;
        }
        //there is no selection
        if (selectionEnd == selectionStart) {
            //delete key and the target digit is a number
            if ((keyCode == 46 || keyCode == 63272) && /^\d+$/.test(this.rawValue.substring(selectionStart, selectionEnd + 1))) {
                selectionEnd = selectionEnd + 1;
            }
            //delete key and the target digit is the decimal or thousands divider
            if ((keyCode == 46 || keyCode == 63272) && (this.rawValue.substring(selectionStart, selectionEnd + 1) == decimal || this.rawValue.substring(selectionStart, selectionEnd + 1) == thousands)) {
                selectionEnd = selectionEnd + 2;
                selectionStart = selectionStart + 1;
            }
            //backspace key and the target digit is a number
            if (keyCode == 8 && /^\d+$/.test(this.rawValue.substring(selectionStart - 1, selectionEnd))) {
                selectionStart = selectionStart - 1;
            }
            //backspace key and the target digit is the decimal or thousands divider
            if (keyCode == 8 && (this.rawValue.substring(selectionStart - 1, selectionEnd) == decimal || this.rawValue.substring(selectionStart - 1, selectionEnd) == thousands)) {
                selectionStart = selectionStart - 2;
                selectionEnd = selectionEnd - 1;
            }
        }
        this.rawValue = this.rawValue.substring(0, selectionStart) + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart);
    }
    updateFieldValue(selectionStart) {
        let newRawValue = this.applyMask(false, this.rawValue || "");
        selectionStart = selectionStart == undefined ? this.rawValue.length : selectionStart;
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
    }
    updateOptions(options) {
        let value = this.value;
        this.options = options;
        this.value = value;
    }
    get canInputMoreNumbers() {
        return this.inputManager.canInputMoreNumbers;
    }
    get inputSelection() {
        return this.inputManager.inputSelection;
    }
    get rawValue() {
        return this.inputManager.rawValue;
    }
    set rawValue(value) {
        this.inputManager.rawValue = value;
    }
    get storedRawValue() {
        return this.inputManager.storedRawValue;
    }
    get value() {
        return this.clearMask(this.rawValue);
    }
    set value(value) {
        this.rawValue = this.applyMask(true, "" + value);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9tc2l2YWRlL0Rldi9wcm9qZWN0cy9uZzItY3VycmVuY3ktbWFzay9wcm9qZWN0cy9uZzItY3VycmVuY3ktbWFzay9zcmMvIiwic291cmNlcyI6WyJsaWIvaW5wdXQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsTUFBTSxPQUFPLFlBQVk7SUFJckIsWUFBb0IsZ0JBQXFCLEVBQVUsT0FBWTtRQUEzQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQUs7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFLO1FBQzNELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsU0FBUyxDQUFDLE9BQWU7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM5QztRQUVELElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7UUFDeEQsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUM7UUFDcEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25JLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEdBQUcs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QVEsR0FBRyxLQUFLLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUksY0FBYztRQUNkLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7SUFDNUMsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQWE7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5wdXRNYW5hZ2VyIH0gZnJvbSBcIi4vaW5wdXQubWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgaW5wdXRNYW5hZ2VyOiBJbnB1dE1hbmFnZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0bWxJbnB1dEVsZW1lbnQ6IGFueSwgcHJpdmF0ZSBvcHRpb25zOiBhbnkpIHtcbiAgICAgICAgdGhpcy5pbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXRNYW5hZ2VyKGh0bWxJbnB1dEVsZW1lbnQpO1xuICAgIH1cblxuICAgIGFkZE51bWJlcihrZXlDb2RlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnJhd1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnJhd1ZhbHVlID0gdGhpcy5hcHBseU1hc2soZmFsc2UsIFwiMFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBrZXlDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2RlKTtcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgbGV0IHNlbGVjdGlvbkVuZCA9IHRoaXMuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uRW5kO1xuICAgICAgICB0aGlzLnJhd1ZhbHVlID0gdGhpcy5yYXdWYWx1ZS5zdWJzdHJpbmcoMCwgc2VsZWN0aW9uU3RhcnQpICsga2V5Q2hhciArIHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvbkVuZCwgdGhpcy5yYXdWYWx1ZS5sZW5ndGgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUZpZWxkVmFsdWUoc2VsZWN0aW9uU3RhcnQgKyAxKTtcbiAgICB9XG5cbiAgICBhcHBseU1hc2soaXNOdW1iZXI6IGJvb2xlYW4sIHJhd1ZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgeyBhbGxvd05lZ2F0aXZlLCBkZWNpbWFsLCBwcmVjaXNpb24sIHByZWZpeCwgc3VmZml4LCB0aG91c2FuZHMgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgcmF3VmFsdWUgPSBpc051bWJlciA/IG5ldyBOdW1iZXIocmF3VmFsdWUpLnRvRml4ZWQocHJlY2lzaW9uKSA6IHJhd1ZhbHVlO1xuICAgICAgICBsZXQgb25seU51bWJlcnMgPSByYXdWYWx1ZS5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIik7XG5cbiAgICAgICAgaWYgKCFvbmx5TnVtYmVycykge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW50ZWdlclBhcnQgPSBvbmx5TnVtYmVycy5zbGljZSgwLCBvbmx5TnVtYmVycy5sZW5ndGggLSBwcmVjaXNpb24pLnJlcGxhY2UoL14wKi9nLCBcIlwiKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCB0aG91c2FuZHMpO1xuXG4gICAgICAgIGlmIChpbnRlZ2VyUGFydCA9PSBcIlwiKSB7XG4gICAgICAgICAgICBpbnRlZ2VyUGFydCA9IFwiMFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1Jhd1ZhbHVlID0gaW50ZWdlclBhcnQ7XG4gICAgICAgIGxldCBkZWNpbWFsUGFydCA9IG9ubHlOdW1iZXJzLnNsaWNlKG9ubHlOdW1iZXJzLmxlbmd0aCAtIHByZWNpc2lvbik7XG5cbiAgICAgICAgaWYgKHByZWNpc2lvbiA+IDApIHtcbiAgICAgICAgICAgIGRlY2ltYWxQYXJ0ID0gXCIwXCIucmVwZWF0KHByZWNpc2lvbiAtIGRlY2ltYWxQYXJ0Lmxlbmd0aCkgKyBkZWNpbWFsUGFydDtcbiAgICAgICAgICAgIG5ld1Jhd1ZhbHVlICs9IGRlY2ltYWwgKyBkZWNpbWFsUGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpc1plcm8gPSBwYXJzZUludChpbnRlZ2VyUGFydCkgPT0gMCAmJiAocGFyc2VJbnQoZGVjaW1hbFBhcnQpID09IDAgfHwgZGVjaW1hbFBhcnQgPT0gXCJcIik7XG4gICAgICAgIGxldCBvcGVyYXRvciA9IChyYXdWYWx1ZS5pbmRleE9mKFwiLVwiKSA+IC0xICYmIGFsbG93TmVnYXRpdmUgJiYgIWlzWmVybykgPyBcIi1cIiA6IFwiXCI7XG4gICAgICAgIHJldHVybiBvcGVyYXRvciArIHByZWZpeCArIG5ld1Jhd1ZhbHVlICsgc3VmZml4O1xuICAgIH1cblxuICAgIGNsZWFyTWFzayhyYXdWYWx1ZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHJhd1ZhbHVlID09IG51bGwgfHwgcmF3VmFsdWUgPT0gXCJcIikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSByYXdWYWx1ZS5yZXBsYWNlKHRoaXMub3B0aW9ucy5wcmVmaXgsIFwiXCIpLnJlcGxhY2UodGhpcy5vcHRpb25zLnN1ZmZpeCwgXCJcIik7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50aG91c2FuZHMpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXFwiICsgdGhpcy5vcHRpb25zLnRob3VzYW5kcywgXCJnXCIpLCBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVjaW1hbCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHRoaXMub3B0aW9ucy5kZWNpbWFsLCBcIi5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgY2hhbmdlVG9OZWdhdGl2ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbGxvd05lZ2F0aXZlICYmIHRoaXMucmF3VmFsdWUgIT0gXCJcIiAmJiB0aGlzLnJhd1ZhbHVlLmNoYXJBdCgwKSAhPSBcIi1cIiAmJiB0aGlzLnZhbHVlICE9IDApIHtcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25TdGFydCA9IHRoaXMuaW5wdXRTZWxlY3Rpb24uc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgICAgICB0aGlzLnJhd1ZhbHVlID0gXCItXCIgKyB0aGlzLnJhd1ZhbHVlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0ICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VUb1Bvc2l0aXZlKCk6IHZvaWQge1xuICAgICAgICBsZXQgc2VsZWN0aW9uU3RhcnQgPSB0aGlzLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICB0aGlzLnJhd1ZhbHVlID0gdGhpcy5yYXdWYWx1ZS5yZXBsYWNlKFwiLVwiLCBcIlwiKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0IC0gMSk7XG4gICAgfVxuXG4gICAgZml4Q3Vyc29yUG9zaXRpb24oZm9yY2VUb0VuZFBvc2l0aW9uPzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBsZXQgY3VycmVudEN1cnNvclBvc2l0aW9uID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydDtcblxuICAgICAgICAvL2lmIHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvbiBpcyBhZnRlciB0aGUgbnVtYmVyIGVuZCBwb3NpdGlvbiwgaXQgaXMgbW92ZWQgdG8gdGhlIGVuZCBvZiB0aGUgbnVtYmVyLCBpZ25vcmluZyB0aGUgcHJlZml4IG9yIHN1ZmZpeC4gdGhpcyBiZWhhdmlvciBjYW4gYmUgZm9yY2VkIHdpdGggZm9yY2VUb0VuZFBvc2l0aW9uIGZsYWdcbiAgICAgICAgaWYgKGN1cnJlbnRDdXJzb3JQb3NpdGlvbiA+IHRoaXMuZ2V0UmF3VmFsdWVXaXRob3V0U3VmZml4RW5kUG9zaXRpb24oKSB8fCBmb3JjZVRvRW5kUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRNYW5hZ2VyLnNldEN1cnNvckF0KHRoaXMuZ2V0UmF3VmFsdWVXaXRob3V0U3VmZml4RW5kUG9zaXRpb24oKSk7XG4gICAgICAgICAgICAvL2lmIHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvbiBpcyBiZWZvcmUgdGhlIG51bWJlciBzdGFydCBwb3NpdGlvbiwgaXQgaXMgbW92ZWQgdG8gdGhlIHN0YXJ0IG9mIHRoZSBudW1iZXIsIGlnbm9yaW5nIHRoZSBwcmVmaXggb3Igc3VmZml4XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEN1cnNvclBvc2l0aW9uIDwgdGhpcy5nZXRSYXdWYWx1ZVdpdGhvdXRQcmVmaXhTdGFydFBvc2l0aW9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRNYW5hZ2VyLnNldEN1cnNvckF0KHRoaXMuZ2V0UmF3VmFsdWVXaXRob3V0UHJlZml4U3RhcnRQb3NpdGlvbigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFJhd1ZhbHVlV2l0aG91dFN1ZmZpeEVuZFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoO1xuICAgIH1cblxuICAgIGdldFJhd1ZhbHVlV2l0aG91dFByZWZpeFN0YXJ0UG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgIT0gbnVsbCAmJiB0aGlzLnZhbHVlIDwgMCA/IHRoaXMub3B0aW9ucy5wcmVmaXgubGVuZ3RoICsgMSA6IHRoaXMub3B0aW9ucy5wcmVmaXgubGVuZ3RoO1xuICAgIH1cblxuICAgIHJlbW92ZU51bWJlcihrZXlDb2RlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgbGV0IHsgZGVjaW1hbCwgdGhvdXNhbmRzIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGxldCBzZWxlY3Rpb25FbmQgPSB0aGlzLmlucHV0U2VsZWN0aW9uLnNlbGVjdGlvbkVuZDtcbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dFNlbGVjdGlvbi5zZWxlY3Rpb25TdGFydDtcblxuICAgICAgICBpZiAoc2VsZWN0aW9uU3RhcnQgPiB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoO1xuICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSB0aGlzLnJhd1ZhbHVlLmxlbmd0aCAtIHRoaXMub3B0aW9ucy5zdWZmaXgubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90aGVyZSBpcyBubyBzZWxlY3Rpb25cbiAgICAgICAgaWYgKHNlbGVjdGlvbkVuZCA9PSBzZWxlY3Rpb25TdGFydCkge1xuICAgICAgICAgICAgLy9kZWxldGUga2V5IGFuZCB0aGUgdGFyZ2V0IGRpZ2l0IGlzIGEgbnVtYmVyXG4gICAgICAgICAgICBpZiAoKGtleUNvZGUgPT0gNDYgfHwga2V5Q29kZSA9PSA2MzI3MikgJiYgL15cXGQrJC8udGVzdCh0aGlzLnJhd1ZhbHVlLnN1YnN0cmluZyhzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kICsgMSkpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uRW5kICsgMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9kZWxldGUga2V5IGFuZCB0aGUgdGFyZ2V0IGRpZ2l0IGlzIHRoZSBkZWNpbWFsIG9yIHRob3VzYW5kcyBkaXZpZGVyXG4gICAgICAgICAgICBpZiAoKGtleUNvZGUgPT0gNDYgfHwga2V5Q29kZSA9PSA2MzI3MikgJiYgKHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQgKyAxKSA9PSBkZWNpbWFsIHx8IHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQgKyAxKSA9PSB0aG91c2FuZHMpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uRW5kICsgMjtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvblN0YXJ0ICsgMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9iYWNrc3BhY2Uga2V5IGFuZCB0aGUgdGFyZ2V0IGRpZ2l0IGlzIGEgbnVtYmVyXG4gICAgICAgICAgICBpZiAoa2V5Q29kZSA9PSA4ICYmIC9eXFxkKyQvLnRlc3QodGhpcy5yYXdWYWx1ZS5zdWJzdHJpbmcoc2VsZWN0aW9uU3RhcnQgLSAxLCBzZWxlY3Rpb25FbmQpKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0ID0gc2VsZWN0aW9uU3RhcnQgLSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2JhY2tzcGFjZSBrZXkgYW5kIHRoZSB0YXJnZXQgZGlnaXQgaXMgdGhlIGRlY2ltYWwgb3IgdGhvdXNhbmRzIGRpdmlkZXJcbiAgICAgICAgICAgIGlmIChrZXlDb2RlID09IDggJiYgKHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0IC0gMSwgc2VsZWN0aW9uRW5kKSA9PSBkZWNpbWFsIHx8IHRoaXMucmF3VmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvblN0YXJ0IC0gMSwgc2VsZWN0aW9uRW5kKSA9PSB0aG91c2FuZHMpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uU3RhcnQgPSBzZWxlY3Rpb25TdGFydCAtIDI7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uRW5kIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmF3VmFsdWUgPSB0aGlzLnJhd1ZhbHVlLnN1YnN0cmluZygwLCBzZWxlY3Rpb25TdGFydCkgKyB0aGlzLnJhd1ZhbHVlLnN1YnN0cmluZyhzZWxlY3Rpb25FbmQsIHRoaXMucmF3VmFsdWUubGVuZ3RoKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0KTtcbiAgICB9XG5cbiAgICB1cGRhdGVGaWVsZFZhbHVlKHNlbGVjdGlvblN0YXJ0PzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGxldCBuZXdSYXdWYWx1ZSA9IHRoaXMuYXBwbHlNYXNrKGZhbHNlLCB0aGlzLnJhd1ZhbHVlIHx8IFwiXCIpO1xuICAgICAgICBzZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvblN0YXJ0ID09IHVuZGVmaW5lZCA/IHRoaXMucmF3VmFsdWUubGVuZ3RoIDogc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgIHRoaXMuaW5wdXRNYW5hZ2VyLnVwZGF0ZVZhbHVlQW5kQ3Vyc29yKG5ld1Jhd1ZhbHVlLCB0aGlzLnJhd1ZhbHVlLmxlbmd0aCwgc2VsZWN0aW9uU3RhcnQpO1xuICAgIH1cblxuICAgIHVwZGF0ZU9wdGlvbnMob3B0aW9uczogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBjYW5JbnB1dE1vcmVOdW1iZXJzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dE1hbmFnZXIuY2FuSW5wdXRNb3JlTnVtYmVycztcbiAgICB9XG5cbiAgICBnZXQgaW5wdXRTZWxlY3Rpb24oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRNYW5hZ2VyLmlucHV0U2VsZWN0aW9uO1xuICAgIH1cblxuICAgIGdldCByYXdWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dE1hbmFnZXIucmF3VmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHJhd1ZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5pbnB1dE1hbmFnZXIucmF3VmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgc3RvcmVkUmF3VmFsdWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRNYW5hZ2VyLnN0b3JlZFJhd1ZhbHVlO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGVhck1hc2sodGhpcy5yYXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yYXdWYWx1ZSA9IHRoaXMuYXBwbHlNYXNrKHRydWUsIFwiXCIgKyB2YWx1ZSk7XG4gICAgfVxufSJdfQ==