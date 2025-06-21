erDiagram
    %% ユーザー・メンバー管理
    User {
        string id PK
        string clerk_id
        string display_name
        string profile_image
        string line_id "nullable"
        datetime created_at
        datetime updated_at
    }

    %% 旅行グループ
    Trip {
        string id PK
        string name
        string destination
        date start_date
        date end_date
        decimal budget "nullable"
        string image "nullable"
        string status "計画中|確定|完了"
        datetime created_at
        datetime updated_at
    }

    %% 旅行メンバー（中間テーブル）
    TripMember {
        string id PK
        string trip_id FK
        string clerk_id FK
        datetime created_at
        datetime updated_at
    }

    %% スケジュール日
    ScheduleDay {
        string id PK
        string trip_id FK
        date date
        datetime created_at
        datetime updated_at
    }

    %% スケジュールイベント
    ScheduleEvent {
        string id PK
        string schedule_day_id FK
        string title
        string location
        string type "travel|accommodation|food|activity"
        time start_time
        time end_time
        int duration_minutes
        int order
        text notes "nullable"
        datetime created_at
        datetime updated_at
    }

    %% 未確定イベント
    PendingEvent {
        string id PK
        string trip_id FK
        string suggested_by FK
        string title
        string location
        string type "travel|accommodation|food|activity"
        int estimated_duration_minutes
        string priority "high|medium|low"
        text notes "nullable"
        datetime created_at
        datetime updated_at
    }

    %% 日程調整
    MemberAvailability {
        string id PK
        string trip_id FK
        string clerk_id FK
        date date
        string status "available|unavailable|maybe"
        datetime created_at
        datetime updated_at
    }

    %% 支払い記録
    PaymentRecord {
        string id PK
        string trip_id FK
        string paid_by FK
        string title
        decimal amount
        string category
        date payment_date
        text description
        boolean is_settled
        datetime created_at
        datetime updated_at
    }

    %% 支払い詳細（誰の分を支払ったか）
    PaymentDetail {
        string id PK
        string payment_record_id FK
        string clerk_id FK
        decimal split_amount
        datetime created_at
        datetime updated_at
    }

    %% 活動履歴
    ActivityLog {
        string id PK
        string trip_id FK
        string clerk_id FK
        string target_type "trip|event|payment|schedule"
        string target_id
        text description
        datetime created_at
        datetime updated_at
    }

    %% リレーション定義
    User ||--o{ TripMember : "participates_in"
    Trip ||--o{ TripMember : "has_members"
    Trip ||--o{ ScheduleDay : "has_schedule_days"
    Trip ||--o{ PendingEvent : "has_pending_events"
    Trip ||--o{ MemberAvailability : "has_availabilities"
    Trip ||--o{ PaymentRecord : "has_payments"
    Trip ||--o{ ActivityLog : "has_activities"

    ScheduleDay ||--o{ ScheduleEvent : "contains_events"

    User ||--o{ PendingEvent : "suggests"
    User ||--o{ MemberAvailability : "sets_availability"
    User ||--o{ PaymentRecord : "makes_payment"
    User ||--o{ PaymentDetail : "owes_amount"
    User ||--o{ ActivityLog : "performs_action"

    PaymentRecord ||--o{ PaymentDetail : "has_details"