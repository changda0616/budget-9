import moment from "moment";

class BudgetService {
    
    // getTargetBudget = (start, end) => { budgets.find(item => {
    //     return moment(item.yearMonth).isSame(start, 'month');
    // })};

    query(start, end) {
        const budgets = this.getAll();
        // const targetBudget = this.

        if (start > end || budgets.length === 0) {
            return 0;
        }

        if (moment(start).isSame(end)) {
            const targetBudget = budgets.find(item => {
                return moment(item.yearMonth).isSame(start, 'month');
            });
            const daysAmount = moment(start).daysInMonth();
            return targetBudget.amount / daysAmount;
        }

        if (moment(start).isSame(end, 'month')) {
            const targetBudget = budgets.find(item => {
                return moment(item.yearMonth).isSame(start, 'month');
            });
            const daysDiff = Math.abs(moment(start).diff(end, 'days')) + 1;
            const daysAmount = moment(start).daysInMonth();
            return targetBudget.amount * daysDiff / daysAmount;
        } else {
            const targetBudget = budgets.filter(item => {
                return moment(item.yearMonth).isSameOrAfter(start, 'month') && moment(item.yearMonth).isSameOrBefore(end, 'month');;
            });

            return targetBudget.reduce((sum, budget, i) => {
                if (i === 0) {
                    const daysAmount = moment(budget.yearMonth).daysInMonth();
                    const daysDiff = Math.abs(moment(start).diff(moment(budget.yearMonth).endOf('month'), 'days')) + 1;
                    
                    return sum + (budget.amount * daysDiff / daysAmount);
                }

                if (i === targetBudget.length - 1) {
                    const daysAmount = moment(budget.yearMonth).daysInMonth();
                    const daysDiff = Math.abs(moment(end).diff(moment(budget.yearMonth).startOf('month'), 'days')) + 1;
                    
                    return sum + (budget.amount * daysDiff / daysAmount);
                }

                return sum + budget.amount;
            }, 0);
        }
        
        return 0;
    }
    getAll() { }
}

describe('BudgetService', function () {
    it('start date is after end date', () => {
        const service = new BudgetService();
        service.getAll = () => {
            return [{
                yearMonth: '202401',
                amount: 100
            }];
        }
        expect(service.query(new Date(2024, 0, 6), new Date(2024, 0, 5))).toBe(0);
    })

    it('start date is same as end date', () => {
        const service = new BudgetService();
        service.getAll = () => {
            return [{
                yearMonth: '202401',
                amount: 310
            }];
        }
        expect(service.query(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(10);
    })

    it('Full same month, start date is 0101, end date is 0131', () => {
        const service = new BudgetService();
        service.getAll = () => {
            return [{
                yearMonth: '202401',
                amount: 310
            }];
        }
        expect(service.query(new Date(2024, 0, 1), new Date(2024, 0, 31))).toBe(310);
    })

    it('Partial same month, start date is 0101, end date is 0115', () => {
        const service = new BudgetService();
        service.getAll = () => {
            return [{
                yearMonth: '202401',
                amount: 310
            }];
        }
        expect(service.query(new Date(2024, 0, 1), new Date(2024, 0, 15))).toBe(150);
    })

    it('Not same month, start date is 0101, end date is 0215', () => {
        const service = new BudgetService();
        service.getAll = () => {
            return [{
                yearMonth: '202401',
                amount: 310
            },
            {
                yearMonth: '202402',
                amount: 400
            },
            {
                yearMonth: '202403',
                amount: 3100
            }
        ];
        }
        expect(service.query(new Date(2024, 0, 22), new Date(2024, 2, 1))).toBe(600);
    })

    it('No db data, start date is 0201, end date is 0301', () => {
        const service = new BudgetService();
        service.getAll = () => {
            return [{
                yearMonth: '202401',
                amount: 310
            },
            {
                yearMonth: '202404',
                amount: 300
            },
            {
                yearMonth: '202405',
                amount: 310
            }
        ];
        }
        expect(service.query(new Date(2024, 1, 1), new Date(2024, 2, 1))).toBe(0);
    })

});


