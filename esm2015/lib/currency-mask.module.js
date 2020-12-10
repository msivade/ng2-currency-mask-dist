import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CurrencyMaskDirective } from "./currency-mask.directive";
export class CurrencyMaskModule {
}
CurrencyMaskModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule
                ],
                declarations: [
                    CurrencyMaskDirective
                ],
                exports: [
                    CurrencyMaskDirective
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktbWFzay5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvbXNpdmFkZS9EZXYvcHJvamVjdHMvbmcyLWN1cnJlbmN5LW1hc2svcHJvamVjdHMvbmcyLWN1cnJlbmN5LW1hc2svc3JjLyIsInNvdXJjZXMiOlsibGliL2N1cnJlbmN5LW1hc2subW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQWNsRSxNQUFNLE9BQU8sa0JBQWtCOzs7WUFaOUIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRTtvQkFDTCxZQUFZO29CQUNaLFdBQVc7aUJBQ2Q7Z0JBQ0QsWUFBWSxFQUFFO29CQUNWLHFCQUFxQjtpQkFDeEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLHFCQUFxQjtpQkFDeEI7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBDdXJyZW5jeU1hc2tEaXJlY3RpdmUgfSBmcm9tIFwiLi9jdXJyZW5jeS1tYXNrLmRpcmVjdGl2ZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIEN1cnJlbmN5TWFza0RpcmVjdGl2ZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBDdXJyZW5jeU1hc2tEaXJlY3RpdmVcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEN1cnJlbmN5TWFza01vZHVsZSB7XG59Il19