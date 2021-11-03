import { ConsoleLogger, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserMSG } from './common/constants';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
    private readonly logger = new ConsoleLogger(UserController.name);
    constructor(private readonly userService: UserService) { };

    @MessagePattern(UserMSG.CREATE)
    create(@Payload() userDto: UserDTO) {
        return this.userService.create(userDto);
    }

    @MessagePattern(UserMSG.FIND_ALL)
    findAll() {
        return this.userService.findAll();
    }

    @MessagePattern(UserMSG.FIND_ONE)
    findOne(@Payload() id: string) {
        return this.userService.findOne(id);
    }

    @MessagePattern(UserMSG.UPDATE)
    update(@Payload() payload: any) {
        return this.userService.update(payload.id, payload.userDto);
    }

    @MessagePattern(UserMSG.DELETE)
    delete(@Payload() id: string) {
        return this.userService.delete(id);
    }

    @MessagePattern(UserMSG.VALID_USER)
    async validateUser(@Payload() payload: any): Promise<any> {
        const user = await this.userService.findByUsername(payload.username);
        
        this.logger.debug('The user is: ', user);

        this.logger.debug('Password from UI: ', payload.password);
        this.logger.debug('Password from MongoDB: ', user.password);
        const isValidPassword = await this.userService.checkPassword(payload.password, user.password);

        if(user && isValidPassword) return user;

        return null;
    }
}
