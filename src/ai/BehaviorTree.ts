/**
 * Behavior Status Enum
 * Nodes return one of these states after execution.
 */
export enum BehaviorStatus {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    RUNNING = 'RUNNING'
}

export type BTContext = Record<string, any>;

/**
 * Abstract Base Node
 */
export abstract class BehaviorNode {
    abstract tick(context: BTContext): BehaviorStatus;
}

/**
 * Selector Node (OR Logic)
 * Runs children in order. Returns SUCCESS if ANY child succeeds.
 * Returns FAILURE only if ALL children fail.
 */
export class Selector extends BehaviorNode {
    private children: BehaviorNode[];

    constructor(children: BehaviorNode[]) {
        super();
        this.children = children;
    }

    tick(context: BTContext): BehaviorStatus {
        for (const child of this.children) {
            const status = child.tick(context);
            if (status !== BehaviorStatus.FAILURE) {
                return status;
            }
        }
        return BehaviorStatus.FAILURE;
    }
}

/**
 * Sequence Node (AND Logic)
 * Runs children in order. Returns SUCCESS only if ALL children succeed.
 * Returns FAILURE immediately if ANY child fails.
 */
export class Sequence extends BehaviorNode {
    private children: BehaviorNode[];

    constructor(children: BehaviorNode[]) {
        super();
        this.children = children;
    }

    tick(context: BTContext): BehaviorStatus {
        for (const child of this.children) {
            const status = child.tick(context);
            if (status !== BehaviorStatus.SUCCESS) {
                return status;
            }
        }
        return BehaviorStatus.SUCCESS;
    }
}

/**
 * Condition Node (Leaf)
 * Checks a condition in the context. Returns SUCCESS or FAILURE.
 */
export class Condition extends BehaviorNode {
    private predicate: (context: BTContext) => boolean;

    constructor(predicate: (context: BTContext) => boolean) {
        super();
        this.predicate = predicate;
    }

    tick(context: BTContext): BehaviorStatus {
        return this.predicate(context) ? BehaviorStatus.SUCCESS : BehaviorStatus.FAILURE;
    }
}

/**
 * Action Node (Leaf)
 * Performs an action. Can return SUCCESS, FAILURE, or RUNNING.
 */
export class Action extends BehaviorNode {
    private action: (context: BTContext) => BehaviorStatus;

    constructor(action: (context: BTContext) => BehaviorStatus) {
        super();
        this.action = action;
    }

    tick(context: BTContext): BehaviorStatus {
        return this.action(context);
    }
}
